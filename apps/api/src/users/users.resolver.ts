import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permission } from "../generated/prisma/enums.js";
import { CreateUserInput } from "./dto/create-user.input.js";
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
}
