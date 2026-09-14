import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getHealth(): Promise<number> {
    return await this.prisma.user.count();
  }
}
