import { randomBytes } from "node:crypto";
import { Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { LoginInput } from "./dto/login.input.dto.js";
import { SessionsService } from "./sessions.service.js";

@Injectable()
export class AuthService implements OnModuleInit {
  private fakeHash: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionsService: SessionsService,
  ) {}

  async onModuleInit() {
    this.fakeHash = await argon2.hash(randomBytes(32));
  }

  async login(dto: LoginInput): Promise<{ payload: AuthPayload; sessionId: string }> {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });

    const passwordOk = await argon2.verify(user?.passwordHash ?? this.fakeHash, password);

    if (!user?.isActive || !user.passwordHash || !passwordOk) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const sessionId = await this.sessionsService.createSession(user.id);

    return {
      payload: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
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
    await this.sessionsService.deleteSession(sessionId);
  }

  async me(userId: string): Promise<AuthPayload> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    if (!user?.isActive) {
      throw new UnauthorizedException("Unauthorized");
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
