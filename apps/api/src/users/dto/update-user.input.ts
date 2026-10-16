import { Field, InputType } from "@nestjs/graphql";
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

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Field(() => String, { nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Field(() => String, { nullable: true })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  middleName?: string | null;

  @IsOptional()
  @IsEnum(Role)
  @Field(() => Role, { nullable: true })
  role?: Role;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value == null ? value : new Date(value)))
  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @IsOptional()
  @IsPhoneNumber("RU")
  @Field(() => String, { nullable: true })
  phone?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  telegram?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  whatsapp?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  maxAccount?: string | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  jobTitle?: string | null;

  @IsOptional()
  @IsEnum(Permission, { each: true })
  @Field(() => [Permission], { nullable: true })
  extraPermissions?: Permission[];
}
