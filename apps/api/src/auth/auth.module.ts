import { Module } from "@nestjs/common";
import { AuthResolver } from "./auth.resolver.js";
import { AuthService } from "./auth.service.js";
import { GqlAuthGuard } from "./guards/gql-auth.guard.js";
import { PermissionsGuard } from "./guards/permissions.guard.js";
import { PermissionsService } from "./permissions.service.js";
import { SessionsService } from "./sessions.service.js";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    GqlAuthGuard,
    PermissionsGuard,
    PermissionsService,
    SessionsService,
  ],
  exports: [GqlAuthGuard, PermissionsGuard, PermissionsService, SessionsService],
})
export class AuthModule {}
