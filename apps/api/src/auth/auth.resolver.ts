import { UseGuards } from "@nestjs/common";
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
    const cookieName = this.configService.get("COOKIE_NAME");
    const maxAgeSec = this.configService.get("COOKIE_MAX_AGE_SECONDS");

    const { payload, sessionId } = await this.authService.login(input);
    context.res.cookie(cookieName, sessionId, {
      ...sessionCookieOptions(this.configService.get("NODE_ENV") === "production"),
      maxAge: maxAgeSec * 1000,
    });
    return payload;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => AuthPayload)
  me(@Context() context: GqlContext) {
    return context.req.user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: GqlContext): Promise<boolean> {
    const cookieName = this.configService.get("COOKIE_NAME");
    const sessionId = context.req.cookies?.[cookieName] as string | undefined;
    await this.authService.logout(sessionId);
    context.res.clearCookie(
      cookieName,
      sessionCookieOptions(this.configService.get("NODE_ENV") === "production"),
    );
    return true;
  }
}
