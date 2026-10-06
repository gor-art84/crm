import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { ClientType, PartyStatus } from "../../generated/prisma/enums.js";

registerEnumType(ClientType, {
  name: "ClientType",
});

registerEnumType(PartyStatus, {
  name: "PartyStatus",
});

@ObjectType()
export class PartyObject {
  @Field(() => String)
  fullName: string;
  @Field(() => String, { nullable: true })
  shortName?: string;
  @Field(() => ClientType)
  type: ClientType;
  @Field(() => String)
  inn: string;
  @Field(() => String, { nullable: true })
  kpp?: string;
  @Field(() => String, { nullable: true })
  ogrn?: string;
  @Field(() => String, { nullable: true })
  okpo?: string;
  @Field(() => String, { nullable: true })
  okved?: string;
  @Field(() => String, { nullable: true })
  legalAddress?: string;
  @Field(() => String, { nullable: true })
  phone?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String, { nullable: true })
  directorName?: string;
  @Field(() => String, { nullable: true })
  directorPosition?: string;
  @Field(() => String, { nullable: true })
  website?: string;
  @Field(() => PartyStatus, { nullable: true })
  status?: PartyStatus;
  @Field(() => Int, { nullable: true })
  employeeCount?: number;
}
