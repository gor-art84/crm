import { Field, InputType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";
import { IsOptionalNonNull } from "../../common/is-optional-non-null.js";
import { UiDensity, UiThemeMode } from "../ui-settings.enums.js";

@InputType()
export class UpdateMyUiSettingsInput {
  @IsEnum(UiThemeMode)
  @IsOptionalNonNull()
  @Field(() => UiThemeMode, { nullable: true })
  themeMode?: UiThemeMode;

  @IsEnum(UiDensity)
  @IsOptionalNonNull()
  @Field(() => UiDensity, { nullable: true })
  density?: UiDensity;
}
