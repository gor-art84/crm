import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import type { GqlContext } from "../auth/gql-context.js";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permission } from "../generated/prisma/enums.js";
import { CreateUserInput } from "./dto/create-user.input.js";
import { UpdateUserInput } from "./dto/update-user.input.js";
import { UserObject } from "./dto/user.object.js";
import { UsersService } from "./users.service.js";

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserObject])
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_READ)
  async users() {
    return this.usersService.findMany();
  }

  @Mutation(() => UserObject)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => UserObject)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async deactivateUser(@Args("userId") userId: string, @Context() context: GqlContext) {
    const actorUserId = context.req.session?.userId;
    if (!actorUserId) {
      throw new UnauthorizedException("Actor user ID is not available");
    }
    return this.usersService.deactivate(userId, actorUserId);
  }

  @Mutation(() => UserObject)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async activateUser(@Args("userId") userId: string) {
    return this.usersService.activate(userId);
  }

  @Mutation(() => UserObject)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async updateUser(
    @Args("userId") userId: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(userId, updateUserInput);
  }
}
