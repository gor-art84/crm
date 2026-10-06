import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { DadataService } from "../dadata/dadata.service.js";
import { Permission } from "../generated/prisma/enums.js";
import { ClientsService } from "./clients.service.js";
import { ClientObject } from "./dto/client.object.js";
import { ClientLookupObject } from "./dto/client-lookup.object.js";
import { CreateClientInput } from "./dto/create-client.input.js";
import { PartyObject } from "./dto/party-object.dto.js";

@Resolver()
export class ClientsResolver {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly dadataService: DadataService,
  ) {}

  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.CLIENTS_READ)
  @Query(() => [PartyObject])
  async partyByInn(@Args("inn") inn: string) {
    return this.dadataService.findPartyByInn(inn);
  }

  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.CLIENTS_WRITE)
  @Mutation(() => ClientObject)
  async createClient(@Args("createClientInput") createClientInput: CreateClientInput) {
    return this.clientsService.createClient(createClientInput);
  }

  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.CLIENTS_READ)
  @Query(() => [ClientObject])
  async clients() {
    return this.clientsService.findMany();
  }

  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(Permission.CLIENTS_READ)
  @Query(() => ClientLookupObject)
  async lookup(@Args("inn") inn: string) {
    return this.clientsService.lookup(inn);
  }
}
