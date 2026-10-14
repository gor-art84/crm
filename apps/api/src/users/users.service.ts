import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import argon2 from "argon2";
import { ROLE_PERMISSIONS } from "../auth/role-permissions.js";
import { SessionsService } from "../auth/sessions.service.js";
import { emptyToNull } from "../common/empty-to-null.js";
import { Prisma, Role } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserInput } from "./dto/create-user.input.js";
import { UserObject } from "./dto/user.object.js";

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
  role: true,
  isActive: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionsService: SessionsService,
  ) {}

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
    const permissionsBeyondRole = Array.from(extraPermissions).filter(
      (permission) => !ROLE_PERMISSIONS[createUserInput.role].includes(permission),
    );

    const passwordHash = await argon2.hash(createUserInput.password);
    const email = createUserInput.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

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
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!existingUser) {
      throw new NotFoundException("Пользователь не найден");
    }

    if (actorUserId === existingUser.id) {
      throw new ForbiddenException("Нельзя деактивировать самого себя");
    }

    if (existingUser.role === Role.ADMINISTRATOR && existingUser.isActive) {
      const adminUsers = await this.prisma.user.count({
        where: { role: Role.ADMINISTRATOR, isActive: true },
      });
      if (adminUsers <= 1 && existingUser.role === Role.ADMINISTRATOR && existingUser.isActive) {
        throw new ForbiddenException("Нельзя деактивировать последнего администратора");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: userSelect,
    });
    await this.sessionsService.revokeAllSessions(userId);
    return updatedUser;
  }

  async activate(userId: string): Promise<UserObject> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!existingUser) {
      throw new NotFoundException("Пользователь не найден");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: userSelect,
    });
    return updatedUser;
  }
}
