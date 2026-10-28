import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUserId } from "../auth/decorators/current-user-id.decorator.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { UpdateMyProfileInput } from "./dto/update-my-profile.input.js";
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

  @Mutation(() => UserObject)
  @UseGuards(SessionAuthGuard)
  async updateMyProfile(
    @CurrentUserId() userId: string,
    @Args("input") input: UpdateMyProfileInput,
  ) {
    return this.usersService.updateMyProfile(userId, input);
  }
}
