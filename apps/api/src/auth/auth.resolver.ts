import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Args, Context, Int, Mutation, Resolver } from "@nestjs/graphql";
import { EnvConfig } from "../config/env.schema.js";
import { AuthService } from "./auth.service.js";
import { CurrentSessionId } from "./decorators/current-session-id.decorator.js";
import { CurrentUserId } from "./decorators/current-user-id.decorator.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { ChangePasswordInput } from "./dto/change-password.input.js";
import { LoginInput } from "./dto/login.input.dto.js";
import { type GqlContext } from "./gql-context.js";
import { SessionAuthGuard } from "./guards/session-auth.guard.js";
import { sessionCookieOptions } from "./session.js";
import { SessionsService } from "./sessions.service.js";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args("input") input: LoginInput, @Context() context: GqlContext) {
    const cookieName = this.configService.get("COOKIE_NAME", { infer: true });
    const absoluteTimeoutSeconds = this.configService.get("SESSION_ABSOLUTE_TIMEOUT_SECONDS", {
      infer: true,
    });

    const { payload, sessionId } = await this.authService.login(input);
    context.res.cookie(cookieName, sessionId, {
      ...sessionCookieOptions(this.configService.get("NODE_ENV", { infer: true }) === "production"),
      maxAge: absoluteTimeoutSeconds * 1000,
    });
    return payload;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: GqlContext): Promise<boolean> {
    const cookieName = this.configService.get("COOKIE_NAME", { infer: true });
    const sessionId = context.req.cookies?.[cookieName] as string | undefined;
    await this.authService.logout(sessionId);
    context.res.clearCookie(
      cookieName,
      sessionCookieOptions(this.configService.get("NODE_ENV", { infer: true }) === "production"),
    );
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionAuthGuard)
  async changePassword(
    @CurrentSessionId() sessionId: string,
    @CurrentUserId() userId: string,
    @Args("input") input: ChangePasswordInput,
  ): Promise<boolean> {
    return await this.authService.changePassword(userId, sessionId, input);
  }

  @Mutation(() => Int)
  @UseGuards(SessionAuthGuard)
  async revokeOtherSessions(
    @CurrentSessionId() sessionId: string,
    @CurrentUserId() userId: string,
  ): Promise<number> {
    return await this.sessionsService.revokeOtherSessions(userId, sessionId);
  }
}
