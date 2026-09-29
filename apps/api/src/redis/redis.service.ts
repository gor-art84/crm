import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, type RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);
  constructor(configService: ConfigService) {
    this.client = createClient({
      url: configService.getOrThrow("REDIS_URL"),
    });
    this.client.on("error", (err) => {
      this.logger.error("Redis error", err.message);
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  ping() {
    return this.client.ping();
  }

  set(key: string, value: string, ttlSeconds: number) {
    return this.client.set(key, value, { EX: ttlSeconds });
  }

  get(key: string) {
    return this.client.get(key);
  }

  del(key: string) {
    return this.client.del(key);
  }

  expire(key: string, ttlSeconds: number) {
    return this.client.expire(key, ttlSeconds);
  }
}
