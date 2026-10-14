import { Field, InputType } from "@nestjs/graphql";
import { Permission, Role } from "../../generated/prisma/enums.js";

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  middleName?: string | null;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  telegram?: string | null;

  @Field(() => String, { nullable: true })
  whatsapp?: string | null;

  @Field(() => String, { nullable: true })
  maxAccount?: string | null;

  @Field(() => String, { nullable: true })
  jobTitle?: string | null;

  @Field(() => [Permission], { nullable: true })
  extraPermissions?: Permission[];
}
