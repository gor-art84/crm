import { registerEnumType } from "@nestjs/graphql";

export enum InviteStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
}

registerEnumType(InviteStatus, {
  name: "InviteStatus",
});
