import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "../../generated/prisma/enums.js";

@ObjectType()
export class UserObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => String, { nullable: true })
  middleName?: string;

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
}
