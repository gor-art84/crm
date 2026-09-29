import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";
import { RedisService } from "./redis/redis.service.js";

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  async getHealth(): Promise<{ redis: string; prisma: string }> {
    const redis = await this.redis.ping();
    const prisma = (await this.prisma.$queryRaw`SELECT 1`) as { query: string };
    return { redis, prisma: prisma && "OK" };
  }
}
