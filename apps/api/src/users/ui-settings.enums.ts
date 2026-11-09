import { registerEnumType } from "@nestjs/graphql";
import { UiDensity, UiThemeMode } from "../generated/prisma/enums.js";

registerEnumType(UiThemeMode, {
  name: "UiThemeMode",
});

registerEnumType(UiDensity, {
  name: "UiDensity",
});

export { UiDensity, UiThemeMode };
