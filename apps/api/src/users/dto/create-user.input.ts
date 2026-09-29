import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { Permission, Role } from "../../generated/prisma/enums.js";

registerEnumType(Permission, {
  name: "Permission",
});

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  telegram?: string;

  @Field(() => String, { nullable: true })
  whatsapp?: string;

  @Field(() => String, { nullable: true })
  maxAccount?: string;

  @Field(() => String, { nullable: true })
  jobTitle?: string;

  @Field(() => [Permission], { nullable: true })
  extraPermissions?: Permission[];
}
