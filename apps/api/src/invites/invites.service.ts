import { createHash, randomBytes } from "node:crypto";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { EnvConfig } from "../config/env.schema.js";
import { Prisma } from "../generated/prisma/client.js";
import { MAIL, type Mail } from "../mail/mail.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { computeInviteStatus } from "./compute-invite-status.js";
import { InviteStatus } from "./invite-status.enum.js";

@Injectable()
export class InvitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvConfig, true>,
    @Inject(MAIL) private readonly mail: Mail,
  ) {}

  async revokeOpenInvites(tx: Prisma.TransactionClient, userId: string): Promise<void> {
    await tx.userInvite.updateMany({
      where: { userId, usedAt: null, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async createInvite(tx: Prisma.TransactionClient, userId: string): Promise<string> {
    await this.revokeOpenInvites(tx, userId);

    const rawToken = randomBytes(32).toString("base64url");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await tx.userInvite.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  async sendInvite(user: { email: string; firstName: string }, rawToken: string): Promise<void> {
    const inviteUrl = `${this.configService.get("WEB_ORIGIN", { infer: true })}/invite/${rawToken}`;

    await this.mail.send({
      to: user.email,
      subject: "Ваш код приглашения",
      text: [
        `Здравствуйте, ${user.firstName}!`,
        "",
        "Вас пригласили в CRM. Перейдите по ссылке, чтобы задать пароль:",
        inviteUrl,
        "",
        "Ссылка действует 7 дней.",
      ].join("\n"),
    });
  }

  async resend(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, passwordHash: true, isActive: true },
    });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    if (!user.isActive) {
      throw new BadRequestException("Пользователь деактивирован");
    }

    if (user.passwordHash !== null) {
      throw new BadRequestException("Пользователь уже активировал аккаунт");
    }
    const rawToken = await this.prisma.$transaction(
      async (tx) => await this.createInvite(tx, userId),
    );
    await this.sendInvite({ email: user.email, firstName: user.firstName }, rawToken);
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private async findValidInvite(token: string) {
    const tokenHash = this.hashToken(token);
    const invite = await this.prisma.userInvite.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, passwordHash: true, isActive: true },
        },
      },
    });

    if (
      !invite?.user.isActive ||
      invite.usedAt ||
      invite.revokedAt ||
      invite.expiresAt < new Date()
    ) {
      throw new NotFoundException("Приглашение недействительно или истекло");
    }
    if (invite.user.passwordHash) {
      throw new BadRequestException("Пользователь уже зарегистрирован");
    }

    return invite;
  }

  async preview(token: string): Promise<{ email: string; firstName: string }> {
    const invite = await this.findValidInvite(token);
    return { email: invite.user.email, firstName: invite.user.firstName };
  }

  async accept(token: string, password: string): Promise<{ ok: true }> {
    if (password.length < 8) {
      throw new BadRequestException("Пароль должен содержать не менее 8 символов");
    }
    const invite = await this.findValidInvite(token);
    const passwordHash = await argon2.hash(password);

    await this.prisma.$transaction(async (tx) => {
      const result = await tx.userInvite.updateMany({
        where: { id: invite.id, usedAt: null, revokedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });

      if (result.count === 0) {
        throw new NotFoundException("Приглашение недействительно или истекло");
      }
      await tx.user.update({
        where: { id: invite.userId },
        data: { passwordHash },
      });
    });

    return { ok: true };
  }

  /**
   * Expects `userInvites` already narrowed by the query to the latest open invite
   * (usedAt = null, revokedAt = null, ordered by createdAt desc, take 1).
   */
  resolveInviteStatus(user: {
    passwordHash: string | null;
    userInvites: { expiresAt: Date }[];
  }): InviteStatus {
    const latestOpenInvite = user.userInvites[0] ?? null;
    return computeInviteStatus({
      passwordHash: user.passwordHash,
      latestOpenInvite,
    });
  }
}
