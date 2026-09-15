import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Role } from "../../generated/prisma/enums.js";

registerEnumType(Role, {
  name: "Role",
});

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;
}
