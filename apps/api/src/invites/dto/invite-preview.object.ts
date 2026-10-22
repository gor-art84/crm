import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class InvitePreviewObject {
  @Field(() => String)
  email: string;
  @Field(() => String)
  firstName: string;
}
