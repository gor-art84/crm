import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ROLE_PERMISSIONS } from "../auth/role-permissions.js";
import { SessionsService } from "../auth/sessions.service.js";
import { emptyToNull } from "../common/empty-to-null.js";
import { Prisma, Role } from "../generated/prisma/client.js";
import { ImageProcessingService } from "../images/image-processing.service.js";
import { InvitesService } from "../invites/invites.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OBJECT_STORAGE, type ObjectStorage } from "../storage/object-storage.js";
import { CreateUserInput } from "./dto/create-user.input.js";
import { UpdateMyProfileInput } from "./dto/update-my-profile.input.js";
import { UpdateUserInput } from "./dto/update-user.input.js";
import { UserObject } from "./dto/user.object.js";
import { filterPermissionsBeyondRole } from "./user-permissions.js";

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  middleName: true,
  lastName: true,
  birthDate: true,
  phone: true,
  telegram: true,
  whatsapp: true,
  maxAccount: true,
  jobTitle: true,
  avatarKey: true,
  role: true,
  isActive: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionsService: SessionsService,
    @Inject(OBJECT_STORAGE) private readonly storage: ObjectStorage,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly invitesService: InvitesService,
  ) {}

  private static readonly AVATAR_MIME: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  private async requireUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }
    return user;
  }

  private async requireActiveUser(userId: string) {
    const user = await this.requireUser(userId);
    if (!user.isActive) {
      throw new UnauthorizedException("Пользователь не активен");
    }
    return user;
  }

  private async assertCanDemoteAdmin(user: { role: Role; isActive: boolean }): Promise<void> {
    if (user.role !== Role.ADMINISTRATOR || !user.isActive) {
      return;
    }
    const activeAdmins = await this.prisma.user.count({
      where: { role: Role.ADMINISTRATOR, isActive: true },
    });
    if (activeAdmins <= 1) {
      throw new ForbiddenException("Нельзя снять или разжаловать последнего администратора");
    }
  }

  private async assertEmailAvailable(email: string, exceptUserId?: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    if (existing && existing.id !== exceptUserId) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }
  }

  private async toUserObject(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    middleName: string | null;
    birthDate: Date | null;
    phone: string | null;
    telegram: string | null;
    whatsapp: string | null;
    maxAccount: string | null;
    jobTitle: string | null;
    avatarKey?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }): Promise<UserObject> {
    const inviteData = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        passwordHash: true,
        userInvites: {
          where: { usedAt: null, revokedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            expiresAt: true,
          },
        },
      },
    });
    return {
      ...user,
      inviteStatus: this.invitesService.resolveInviteStatus(inviteData),
    };
  }

  private async syncPermissions(
    tx: Prisma.TransactionClient,
    userId: string,
    input: UpdateUserInput,
    role: Role,
  ): Promise<void> {
    if (input.extraPermissions !== undefined) {
      const permissionsBeyondRole = filterPermissionsBeyondRole(role, input.extraPermissions);
      await tx.userPermission.deleteMany({ where: { userId } });
      if (permissionsBeyondRole.length > 0) {
        await tx.userPermission.createMany({
          data: permissionsBeyondRole.map((permission) => ({ userId, permission })),
        });
      }
      return;
    }
    if (input.role !== undefined) {
      await tx.userPermission.deleteMany({
        where: { userId, permission: { in: ROLE_PERMISSIONS[role] } },
      });
    }
  }

  async findMany(): Promise<UserObject[]> {
    const users = await this.prisma.user.findMany({
      select: {
        ...userSelect,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
        userInvites: {
          where: { usedAt: null, revokedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            expiresAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users.map(({ passwordHash, userInvites, ...user }) => ({
      ...user,
      inviteStatus: this.invitesService.resolveInviteStatus({
        passwordHash,
        userInvites,
      }),
    }));
  }

  async create(createUserInput: CreateUserInput): Promise<UserObject> {
    const extraPermissions = new Set(createUserInput.extraPermissions ?? []);
    const permissionsBeyondRole = filterPermissionsBeyondRole(
      createUserInput.role,
      Array.from(extraPermissions),
    );

    const email = createUserInput.email.toLowerCase();
    await this.assertEmailAvailable(email);

    const { user, rawToken } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          middleName: emptyToNull(createUserInput.middleName),
          birthDate: createUserInput.birthDate ?? null,
          phone: emptyToNull(createUserInput.phone),
          telegram: emptyToNull(createUserInput.telegram),
          whatsapp: emptyToNull(createUserInput.whatsapp),
          maxAccount: emptyToNull(createUserInput.maxAccount),
          jobTitle: emptyToNull(createUserInput.jobTitle),
          role: createUserInput.role,
          isActive: true,
          passwordHash: null,
          permissions: {
            create: permissionsBeyondRole.map((permission) => ({ permission })),
          },
        },
        select: userSelect,
      });
      const rawToken = await this.invitesService.createInvite(tx, user.id);
      return { user, rawToken };
    });

    try {
      await this.invitesService.sendInvite(user, rawToken);
    } catch (error) {
      this.logger.error(
        `Failed to send invite for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
    return this.toUserObject(user);
  }

  async deactivate(userId: string, actorUserId: string): Promise<UserObject> {
    const existingUser = await this.requireUser(userId);

    if (actorUserId === existingUser.id) {
      throw new ForbiddenException("Нельзя деактивировать самого себя");
    }

    await this.assertCanDemoteAdmin(existingUser);

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data: { isActive: false },
        select: userSelect,
      });
      await this.invitesService.revokeOpenInvites(tx, userId);
      return updated;
    });

    await this.sessionsService.revokeAllSessions(userId);
    return this.toUserObject(updatedUser);
  }

  async activate(userId: string): Promise<UserObject> {
    await this.requireUser(userId);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: userSelect,
    });
    return this.toUserObject(updatedUser);
  }

  async update(userId: string, input: UpdateUserInput): Promise<UserObject> {
    const user = await this.requireUser(userId);

    if (input.role !== undefined && input.role !== Role.ADMINISTRATOR) {
      await this.assertCanDemoteAdmin(user);
    }

    const data: Prisma.UserUncheckedUpdateInput = {};

    if (input.email !== undefined) {
      const normalized = input.email.toLowerCase();
      if (normalized !== user.email) {
        await this.assertEmailAvailable(normalized, userId);
      }
      data.email = normalized;
    }

    if (input.firstName !== undefined) data.firstName = input.firstName;
    if (input.lastName !== undefined) data.lastName = input.lastName;
    if (input.middleName !== undefined) data.middleName = emptyToNull(input.middleName);
    if (input.role !== undefined) data.role = input.role;
    if (input.birthDate !== undefined) data.birthDate = input.birthDate;
    if (input.phone !== undefined) data.phone = emptyToNull(input.phone);
    if (input.telegram !== undefined) data.telegram = emptyToNull(input.telegram);
    if (input.whatsapp !== undefined) data.whatsapp = emptyToNull(input.whatsapp);
    if (input.maxAccount !== undefined) data.maxAccount = emptyToNull(input.maxAccount);
    if (input.jobTitle !== undefined) data.jobTitle = emptyToNull(input.jobTitle);

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data,
        select: userSelect,
      });

      await this.syncPermissions(tx, userId, input, updated.role);

      return updated;
    });

    return this.toUserObject(updatedUser);
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<{ avatarUrl: string }> {
    if (!file) throw new BadRequestException("Файл не предоставлен");
    if (!UsersService.AVATAR_MIME[file.mimetype])
      throw new BadRequestException(
        "Недопустимый формат файла. Допустимые форматы: png, jpeg, jpg.",
      );
    if (file.size > 10 * 1024 * 1024)
      throw new BadRequestException("Файл слишком большой. Максимальный размер: 10 MB.");

    const processed = await this.imageProcessingService.processImage(file.buffer, "avatar");

    const user = await this.requireUser(userId);
    const key = `avatars/${userId}/${randomUUID()}.${processed.extension}`;

    await this.storage.put({
      key,
      body: processed.buffer,
      contentType: processed.contentType,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarKey: key },
    });

    if (user.avatarKey) {
      try {
        await this.storage.delete(user.avatarKey);
      } catch (error) {
        this.logger.error(`Failed to delete old avatar: ${error}`);
      }
    }
    return { avatarUrl: this.storage.getPublicUrl(key) };
  }

  getAvatarUrl(avatarKey: string | null | undefined): string | null {
    if (!avatarKey) return null;
    return this.storage.getPublicUrl(avatarKey);
  }

  async findMyProfile(userId: string): Promise<UserObject> {
    return this.toUserObject(await this.requireActiveUser(userId));
  }

  async updateMyProfile(userId: string, input: UpdateMyProfileInput): Promise<UserObject> {
    const user = await this.requireActiveUser(userId);
    return await this.update(user.id, input);
  }

  async uploadMyAvatar(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<{ avatarUrl: string }> {
    const user = await this.requireActiveUser(userId);
    return await this.uploadAvatar(user.id, file);
  }
}
