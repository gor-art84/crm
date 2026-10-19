import { UseGuards } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permission } from "../generated/prisma/enums.js";
import { DadataService } from "./dadata.service.js";
import { FioCleanResult } from "./dto/fio-clean-result.object.js";
import { FioSuggestionObject } from "./dto/fio-suggestion.object.js";

@Resolver()
export class DadataResolver {
  constructor(private readonly dadataService: DadataService) {}

  @Query(() => [FioSuggestionObject])
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async fioSuggestions(
    @Args("query") query: string,
    @Args("count", { type: () => Int, nullable: true }) count?: number,
  ): Promise<FioSuggestionObject[]> {
    return await this.dadataService.suggestFio(query, count ?? 7);
  }

  @Query(() => FioCleanResult)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async cleanFio(@Args("query") query: string): Promise<FioCleanResult> {
    return await this.dadataService.cleanFio(query);
  }
}
