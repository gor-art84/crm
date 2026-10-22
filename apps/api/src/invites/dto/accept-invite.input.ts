import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class AcceptInviteInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  token: string;

  @IsString()
  @MinLength(8, { message: "Пароль должен содержать не менее 8 символов" })
  @Field(() => String)
  password: string;
}
