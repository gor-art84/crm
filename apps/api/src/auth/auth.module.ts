import { Module } from "@nestjs/common";
import { AuthResolver } from "./auth.resolver.js";
import { AuthService } from "./auth.service.js";
import { GqlAuthGuard } from "./guards/gql-auth.guard.js";

@Module({
  providers: [AuthResolver, AuthService, GqlAuthGuard],
})
export class AuthModule {}
