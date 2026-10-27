import { randomBytes } from "node:crypto";
import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { ChangePasswordInput } from "./dto/change-password.input.js";
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
      throw new UnauthorizedException("Недействительные учетные данные");
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
      throw new UnauthorizedException("Неавторизован");
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async changePassword(
    userId: string,
    sessionId: string,
    input: ChangePasswordInput,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
        isActive: true,
      },
    });
    if (!user?.isActive || !user.passwordHash) {
      throw new UnauthorizedException("Неавторизован");
    }

    const passwordOk = await argon2.verify(user.passwordHash, input.currentPassword);
    if (!passwordOk) {
      throw new BadRequestException("Неверный текущий пароль");
    }

    if (input.newPassword === input.currentPassword) {
      throw new BadRequestException("Новый пароль должен отличаться от старого");
    }

    const passwordHash = await argon2.hash(input.newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.sessionsService.revokeOtherSessions(userId, sessionId);
    return true;
  }
}
