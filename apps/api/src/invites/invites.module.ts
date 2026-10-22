import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { InvitesResolver } from "./invites.resolver.js";
import { InvitesService } from "./invites.service.js";

@Module({
  imports: [AuthModule],
  providers: [InvitesResolver, InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
