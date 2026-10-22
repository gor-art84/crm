import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { Permission, Role } from "../../generated/prisma/enums.js";

registerEnumType(Permission, {
  name: "Permission",
});

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Field(() => String)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Field(() => String)
  lastName: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  middleName?: string;

  @IsEnum(Role)
  @Field(() => Role)
  role: Role;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value == null ? value : new Date(value)))
  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @IsOptional()
  @IsPhoneNumber("RU")
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  telegram?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  maxAccount?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  jobTitle?: string;

  @IsOptional()
  @IsEnum(Permission, { each: true })
  @Field(() => [Permission], { nullable: true })
  extraPermissions?: Permission[];
}
