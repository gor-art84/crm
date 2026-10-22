import { applyDecorators } from "@nestjs/common";
import { ValidateIf } from "class-validator";

export const IsOptionalNonNull = () => {
  return applyDecorators(ValidateIf((_object, value) => value !== undefined));
};
