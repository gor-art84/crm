import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { EnvConfig } from "../config/env.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService<EnvConfig, true>) {
    const url = configService.get("DATABASE_URL", { infer: true });
    const adapter = new PrismaPg({
      connectionString: url,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
