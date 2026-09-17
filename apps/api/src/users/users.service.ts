import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

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
}
