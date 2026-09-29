import { Injectable } from "@nestjs/common";
import { Permission } from "../generated/prisma/enums.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ROLE_PERMISSIONS } from "./role-permissions.js";

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEffective(userId: string): Promise<Set<Permission>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
    if (!user) {
      return new Set();
    }
    const extra = user.permissions.map((permission) => permission.permission);
    return new Set([...ROLE_PERMISSIONS[user.role], ...extra]);
  }
}
