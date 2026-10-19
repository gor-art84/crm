import { Module } from "@nestjs/common";
import { AuthResolver } from "./auth.resolver.js";
import { AuthService } from "./auth.service.js";
import { PermissionsGuard } from "./guards/permissions.guard.js";
import { SessionAuthGuard } from "./guards/session-auth.guard.js";
import { PermissionsService } from "./permissions.service.js";
import { SessionsService } from "./sessions.service.js";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    SessionAuthGuard,
    PermissionsGuard,
    PermissionsService,
    SessionsService,
  ],
  exports: [SessionAuthGuard, PermissionsGuard, PermissionsService, SessionsService],
})
export class AuthModule {}
