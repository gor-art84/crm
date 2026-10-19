import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FioSuggestionObject {
  @Field(() => String)
  value: string;
  @Field(() => String, { nullable: true })
  surname?: string | null;
  @Field(() => String, { nullable: true })
  name?: string | null;
  @Field(() => String, { nullable: true })
  patronymic?: string | null;
}
