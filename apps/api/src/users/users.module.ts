import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { InvitesModule } from "../invites/invites.module.js";
import { ProfileResolver } from "./profile.resolver.js";
import { UsersController } from "./users.controller.js";
import { UsersResolver } from "./users.resolver.js";
import { UsersService } from "./users.service.js";

@Module({
  imports: [AuthModule, InvitesModule],
  providers: [UsersResolver, UsersService, ProfileResolver],
  controllers: [UsersController],
})
export class UsersModule {}
