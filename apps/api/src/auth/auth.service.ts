import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service.js";
import { RedisService } from "../redis/redis.service.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { LoginInput } from "./dto/login.input.dto.js";
import { RedisSessionData, sessionKey } from "./session.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginInput): Promise<{ payload: AuthPayload; sessionId: string }> {
    const { email, password } = dto;
    const TTL_SECONDS = Number(this.configService.getOrThrow<number>("SESSION_TTL_SECONDS"));
    if (!Number.isFinite(TTL_SECONDS)) {
      throw new Error("SESSION_TTL_SECONDS must be a number");
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
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
      userEmail: user.email,
      userRole: user.role,
      issuedAt: new Date().toISOString(),
    };
    await this.redisService.set(sessionKey(sessionId), JSON.stringify(sessionData), TTL_SECONDS);

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
    await this.redisService.del(sessionKey(sessionId));
  }
}
