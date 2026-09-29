import { ConflictException, Injectable } from "@nestjs/common";
import argon2 from "argon2";
import { ROLE_PERMISSIONS } from "../auth/role-permissions.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserInput } from "./dto/create-user.input.js";

function emptyToNull(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

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
      },
      orderBy: {
        lastName: "asc",
      },
    });
  }

  async create(createUserInput: CreateUserInput) {
    const effectivePermissions = new Set([
      ...ROLE_PERMISSIONS[createUserInput.role],
      ...(createUserInput.extraPermissions ?? []),
    ]);

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
          create: Array.from(effectivePermissions).map((permission) => ({ permission })),
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
