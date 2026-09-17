import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Role } from "../generated/prisma/enums.js";
import { UserObject } from "./dto/user.object.js";
import { UsersService } from "./users.service.js";

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserObject])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async users() {
    return this.usersService.findMany();
  }
}
