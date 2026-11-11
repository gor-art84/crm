import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUserId } from "../auth/decorators/current-user-id.decorator.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { UpdateMyProfileInput } from "./dto/update-my-profile.input.js";
import { UpdateMyUiSettingsInput } from "./dto/update-my-ui-settings.input.js";
import { UserObject } from "./dto/user.object.js";
import { UsersService } from "./users.service.js";

@Resolver()
export class ProfileResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserObject)
  @UseGuards(SessionAuthGuard)
  async me(@CurrentUserId() userId: string) {
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

  @Mutation(() => UserObject)
  @UseGuards(SessionAuthGuard)
  async updateMyUiSettings(
    @CurrentUserId() userId: string,
    @Args("input") input: UpdateMyUiSettingsInput,
  ) {
    return this.usersService.updateMyUiSettings(userId, input);
  }

  @Mutation(() => UserObject)
  @UseGuards(SessionAuthGuard)
  async deleteMyAvatar(@CurrentUserId() userId: string) {
    return this.usersService.deleteMyAvatar(userId);
  }
}
