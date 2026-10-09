import { ConflictException, Injectable } from "@nestjs/common";
import argon2 from "argon2";
import { ROLE_PERMISSIONS } from "../auth/role-permissions.js";
import { emptyToNull } from "../common/empty-to-null.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserInput } from "./dto/create-user.input.js";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.user.findMany({
      select: {
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(createUserInput: CreateUserInput) {
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
      select: {
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
      },
    });

    return user;
  }
}
