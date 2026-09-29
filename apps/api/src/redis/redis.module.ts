import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service.js";

@Global()
@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
