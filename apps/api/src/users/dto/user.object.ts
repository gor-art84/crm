import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "../../generated/prisma/enums.js";
import { InviteStatus } from "../../invites/invite-status.enum.js";
import { UiDensity, UiThemeMode } from "../ui-settings.enums.js";

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
  middleName: string | null;

  @Field(() => Date, { nullable: true })
  birthDate: Date | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => String, { nullable: true })
  telegram: string | null;

  @Field(() => String, { nullable: true })
  whatsapp: string | null;

  @Field(() => String, { nullable: true })
  maxAccount: string | null;

  @Field(() => String, { nullable: true })
  jobTitle: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => UiThemeMode, { nullable: true })
  themeMode: UiThemeMode | null;

  @Field(() => UiDensity, { nullable: true })
  density: UiDensity | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;

  @Field(() => InviteStatus)
  inviteStatus: InviteStatus;
}
