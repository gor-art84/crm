import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { EnvConfig } from "../../config/env.schema.js";
import { GqlContext } from "../gql-context.js";
import { SessionsService } from "../sessions.service.js";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const absoluteTimeoutSeconds = this.configService.get("SESSION_ABSOLUTE_TIMEOUT_SECONDS", {
      infer: true,
    });
    const request: GqlContext["req"] = GqlExecutionContext.create(context).getContext().req;
    const sessionId = request.cookies[this.configService.get("COOKIE_NAME", { infer: true })];

    if (!sessionId) {
      throw new UnauthorizedException("Unauthorized");
    }

    const session = await this.sessionsService.readSession(sessionId);
    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }

    const { issuedAt } = session;

    const issuedAtMs = Date.parse(issuedAt);
    if (!Number.isFinite(issuedAtMs) || (Date.now() - issuedAtMs) / 1000 > absoluteTimeoutSeconds) {
      await this.sessionsService.deleteSession(sessionId);
      throw new UnauthorizedException("Unauthorized");
    }

    await this.sessionsService.touchSession(sessionId);
    request.session = session;
    return true;
  }
}
