import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { EnvConfig } from "../config/env.schema.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { LoginInput } from "./dto/login.input.dto.js";
import { RedisSessionData, sessionKey, userSessionsKey } from "./session.js";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async login(dto: LoginInput): Promise<{ payload: AuthPayload; sessionId: string }> {
    const { email, password } = dto;
    const sessionIdleTimeoutSeconds = this.configService.get("SESSION_IDLE_TIMEOUT_SECONDS", {
      infer: true,
    });
    const sessionAbsoluteTimeoutSeconds = this.configService.get(
      "SESSION_ABSOLUTE_TIMEOUT_SECONDS",
      {
        infer: true,
      },
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });
    if (!user?.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await argon2.verify(user.passwordHash, password);
    if (!passwordOk) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const sessionId = crypto.randomUUID();
    const sessionData: RedisSessionData = {
      userId: user.id,
      issuedAt: new Date().toISOString(),
    };
    await this.redisService.set(
      sessionKey(sessionId),
      JSON.stringify(sessionData),
      sessionIdleTimeoutSeconds,
    );
    await this.redisService.sAdd(userSessionsKey(user.id), sessionId);
    await this.redisService.expire(userSessionsKey(user.id), sessionAbsoluteTimeoutSeconds);
    return {
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      sessionId,
    };
  }

  async logout(sessionId: string | undefined): Promise<void> {
    if (!sessionId) {
      return;
    }
    const sessionData = await this.redisService.get(sessionKey(sessionId));
    if (!sessionData) {
      return;
    }
    await this.redisService.del(sessionKey(sessionId));
    try {
      const sessionDataObject: RedisSessionData = JSON.parse(sessionData);
      await this.redisService.sRem(userSessionsKey(sessionDataObject.userId), sessionId);
    } catch (error) {
      this.logger.error(`Error removing session from user sessions set: ${error}`);
    }
  }

  async me(userId: string): Promise<AuthPayload> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user?.isActive) {
      throw new UnauthorizedException("Unauthorized");
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
