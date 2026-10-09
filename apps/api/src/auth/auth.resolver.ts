import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EnvConfig } from "../config/env.schema.js";
import { AuthService } from "./auth.service.js";
import { AuthPayload } from "./dto/auth.payload.js";
import { LoginInput } from "./dto/login.input.dto.js";
import { type GqlContext } from "./gql-context.js";
import { GqlAuthGuard } from "./guards/gql-auth.guard.js";
import { sessionCookieOptions } from "./session.js";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
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

  @UseGuards(GqlAuthGuard)
  @Query(() => AuthPayload)
  async me(@Context() context: GqlContext): Promise<AuthPayload> {
    const userId = context.req.session?.userId;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return await this.authService.me(userId);
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
}
