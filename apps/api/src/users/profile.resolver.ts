import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { CurrentUserId } from "../auth/decorators/current-user-id.decorator.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { UserObject } from "./dto/user.object.js";
import { UsersService } from "./users.service.js";

@Resolver()
export class ProfileResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserObject)
  @UseGuards(SessionAuthGuard)
  async myProfile(@CurrentUserId() userId: string) {
    return this.usersService.findMyProfile(userId);
  }
}
