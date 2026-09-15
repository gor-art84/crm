import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RedisService } from "../../redis/redis.service.js";
import { RedisSessionData, sessionKey } from "../session.js";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cookieMaxAgeSec = Number(this.configService.getOrThrow("COOKIE_MAX_AGE_SECONDS"));
    const request = GqlExecutionContext.create(context).getContext().req;
    const sessionId = request.cookies[this.configService.getOrThrow("COOKIE_NAME")];
    const sessionTTL = Number(this.configService.getOrThrow("SESSION_TTL_SECONDS"));
    if (!Number.isFinite(cookieMaxAgeSec)) {
      throw new Error("COOKIE_MAX_AGE_SECONDS must be a number");
    }
    if (!Number.isFinite(sessionTTL)) {
      throw new Error("SESSION_TTL_SECONDS must be a number");
    }
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
