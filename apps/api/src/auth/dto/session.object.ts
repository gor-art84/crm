import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SessionObject {
  @Field(() => ID)
  id: string;

  @Field(() => Boolean)
  isCurrent: boolean;

  @Field(() => Date)
  issuedAt: Date;

  @Field(() => String, { nullable: true })
  browser?: string | null;

  @Field(() => String, { nullable: true })
  os?: string | null;

  @Field(() => String, { nullable: true })
  deviceType?: string | null;
}
