import { Field, ObjectType } from "@nestjs/graphql";
import { ClientObject } from "./client.object.js";
import { PartyObject } from "./party-object.dto.js";

@ObjectType()
export class ClientLookupObject {
  @Field(() => [ClientObject])
  clients: ClientObject[];

  @Field(() => [PartyObject])
  parties: PartyObject[];
}
