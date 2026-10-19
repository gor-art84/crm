import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FioCleanResult {
  @Field(() => String)
  result: string;
  @Field(() => String, { nullable: true })
  surname?: string | null;
  @Field(() => String, { nullable: true })
  name?: string | null;
  @Field(() => String, { nullable: true })
  patronymic?: string | null;
  @Field(() => String, { nullable: true })
  gender?: string | null;
  @Field(() => Int, { nullable: true })
  qc?: number;
}
