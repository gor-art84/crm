import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import argon2 from "argon2";
import { SessionsService } from "../auth/sessions.service.js";
import { emptyToNull } from "../common/empty-to-null.js";
import { Prisma, Role } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OBJECT_STORAGE, type ObjectStorage } from "../storage/object-storage.js";
import { CreateUserInput } from "./dto/create-user.input.js";
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

  async findMany(): Promise<UserObject[]> {
    return this.prisma.user.findMany({
      select: { ...userSelect, createdAt: true, updatedAt: true },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(createUserInput: CreateUserInput): Promise<UserObject> {
    const extraPermissions = new Set(createUserInput.extraPermissions ?? []);
    const permissionsBeyondRole = filterPermissionsBeyondRole(
      createUserInput.role,
      Array.from(extraPermissions),
    );

    const passwordHash = await argon2.hash(createUserInput.password);
    const email = createUserInput.email.toLowerCase();
    await this.assertEmailAvailable(email);

    const user = await this.prisma.user.create({
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
        passwordHash,
        permissions: {
          create: permissionsBeyondRole.map((permission) => ({ permission })),
        },
      },
      select: userSelect,
    });

    return user;
  }

  async deactivate(userId: string, actorUserId: string): Promise<UserObject> {
    const existingUser = await this.requireUser(userId);

    if (actorUserId === existingUser.id) {
      throw new ForbiddenException("Нельзя деактивировать самого себя");
    }

    await this.assertCanDemoteAdmin(existingUser);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: userSelect,
    });
    await this.sessionsService.revokeAllSessions(userId);
    return updatedUser;
  }

  async activate(userId: string): Promise<UserObject> {
    await this.requireUser(userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: userSelect,
    });
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

    if (input.extraPermissions === undefined) {
      return this.prisma.user.update({
        where: { id: userId },
        data,
        select: userSelect,
      });
    }

    const roleForFilter = input.role ?? user.role;
    const permissionsBeyondRole = filterPermissionsBeyondRole(
      roleForFilter,
      input.extraPermissions ?? [],
    );

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data,
        select: userSelect,
      });

      await tx.userPermission.deleteMany({ where: { userId } });

      if (permissionsBeyondRole.length > 0) {
        await tx.userPermission.createMany({
          data: permissionsBeyondRole.map((permission) => ({ userId, permission })),
        });
      }

      return updatedUser;
    });
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File | undefined,
  ): Promise<{ avatarUrl: string }> {
    if (!file) throw new BadRequestException("Файл не предоставлен");

    const ext = UsersService.AVATAR_MIME[file.mimetype];
    if (!ext)
      throw new BadRequestException(
        "Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и WebP.",
      );

    if (file.size > 2 * 1024 * 1024)
      throw new BadRequestException("Файл слишком большой. Максимальный размер: 2MB.");

    const user = await this.requireUser(userId);
    const key = `avatars/${userId}/${randomUUID()}.${ext}`;

    await this.storage.put({
      key,
      body: file.buffer,
      contentType: file.mimetype,
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
}
