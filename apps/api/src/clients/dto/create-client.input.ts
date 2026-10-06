import { Field, InputType, Int } from "@nestjs/graphql";
import { ClientType, PartyStatus } from "../../generated/prisma/enums.js";

@InputType()
export class CreateClientInput {
  @Field(() => ClientType)
  type: ClientType;
  @Field(() => String)
  fullName: string;
  @Field(() => String, { nullable: true })
  shortName?: string;
  @Field(() => String, { nullable: true })
  inn?: string;
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
  actualAddress?: string;
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
  @Field(() => String, { nullable: true })
  lastName?: string;
  @Field(() => String, { nullable: true })
  firstName?: string;
  @Field(() => String, { nullable: true })
  middleName?: string;
  @Field(() => PartyStatus, { nullable: true })
  status?: PartyStatus;
  @Field(() => Int, { nullable: true })
  employeeCount?: number;
  @Field(() => Boolean, { nullable: true })
  captureDadata?: boolean;
}
