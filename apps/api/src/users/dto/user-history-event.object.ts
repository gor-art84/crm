import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { UserHistoryEventType } from "../../generated/prisma/enums.js";

registerEnumType(UserHistoryEventType, { name: "UserHistoryEventType" });

@ObjectType()
export class UserHistoryEventObject {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  actorUserId: string;

  @Field(() => UserHistoryEventType)
  type: UserHistoryEventType;

  @Field(() => String)
  actorName: string;
}

@ObjectType()
export class MyUserHistoryEventObject {
  @Field(() => String)
  id: string;

  @Field(() => UserHistoryEventType)
  type: UserHistoryEventType;

  @Field(() => Date)
  createdAt: Date;
}
