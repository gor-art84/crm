import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class UserHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyHistory(userId: string) {
    return this.prisma.userHistoryEvent.findMany({
      where: { subjectUserId: userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
    });
  }
}
