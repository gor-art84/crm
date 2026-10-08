import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { EnvConfig } from "../../config/env.schema.js";
import { RedisService } from "../../redis/redis.service.js";
import { RedisSessionData, sessionKey } from "../session.js";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cookieMaxAgeSec = this.configService.get("COOKIE_MAX_AGE_SECONDS");
    const request = GqlExecutionContext.create(context).getContext().req;
    const sessionId = request.cookies[this.configService.get("COOKIE_NAME")];
    const sessionTTL = this.configService.get("SESSION_TTL_SECONDS");

    if (!sessionId) {
      throw new UnauthorizedException("Unauthorized");
    }

    const session = await this.redisService.get(sessionKey(sessionId));
    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }

    let payload: RedisSessionData;
    try {
      payload = JSON.parse(session);
    } catch {
      throw new UnauthorizedException("Unauthorized");
    }

    const issuedAtMs = Date.parse(payload.issuedAt);
    if (!Number.isFinite(issuedAtMs) || (Date.now() - issuedAtMs) / 1000 > cookieMaxAgeSec) {
      await this.redisService.del(sessionKey(sessionId));
      throw new UnauthorizedException("Unauthorized");
    }

    await this.redisService.expire(sessionKey(sessionId), sessionTTL);
    request.user = {
      id: payload.userId,
      email: payload.userEmail,
      role: payload.userRole,
    };
    return true;
  }
}
