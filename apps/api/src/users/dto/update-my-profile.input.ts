import { InputType, PickType } from "@nestjs/graphql";
import { UpdateUserInput } from "./update-user.input.js";

@InputType()
export class UpdateMyProfileInput extends PickType(UpdateUserInput, [
  "firstName",
  "lastName",
  "middleName",
  "birthDate",
  "phone",
  "telegram",
  "whatsapp",
  "maxAccount",
] as const) {}
