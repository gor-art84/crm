import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: "Пароль должен содержать не менее 8 символов" })
  @MaxLength(128, { message: "Пароль должен содержать не более 128 символов" })
  @Field(() => String)
  newPassword: string;
}
