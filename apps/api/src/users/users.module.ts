import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { InvitesModule } from "../invites/invites.module.js";
import { UsersController } from "./users.controller.js";
import { UsersResolver } from "./users.resolver.js";
import { UsersService } from "./users.service.js";

@Module({
  imports: [AuthModule, InvitesModule],
  providers: [UsersResolver, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
