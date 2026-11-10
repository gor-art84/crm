import type { UiDensity, UiThemeMode, UpdateMyUiSettingsInput } from "@/generated/graphql";
import type { Density } from "@/shared/lib/density";
import type { ThemeMode } from "@/shared/ui/theme/theme-mode-options";

const DENSITY_FROM_API = {
  COMPACT: "compact",
  DEFAULT: "default",
} as const satisfies Record<UiDensity, Density>;

export const DENSITY_TO_API = {
  compact: "COMPACT",
  default: "DEFAULT",
} as const satisfies Record<Density, UiDensity>;

const THEME_MODE_FROM_API = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const satisfies Record<UiThemeMode, ThemeMode>;

export const THEME_MODE_TO_API = {
  light: "LIGHT",
  dark: "DARK",
  system: "SYSTEM",
} as const satisfies Record<ThemeMode, UiThemeMode>;

export type LocalUiSettings = { themeMode: ThemeMode; density: Density };
export type ServerUiSettings = { themeMode: UiThemeMode | null; density: UiDensity | null };
export type UiSettingsPlan = {
  apply: Partial<LocalUiSettings>;
  push: UpdateMyUiSettingsInput;
};

export const reconcileUiSettings = (
  local: LocalUiSettings,
  server: ServerUiSettings,
): UiSettingsPlan => {
  const apply: Partial<LocalUiSettings> = {};
  const push: UpdateMyUiSettingsInput = {};

  if (server.themeMode === null) {
    push.themeMode = THEME_MODE_TO_API[local.themeMode];
  } else {
    const serverThemeMode = THEME_MODE_FROM_API[server.themeMode];
    if (serverThemeMode !== local.themeMode) {
      apply.themeMode = serverThemeMode;
    }
  }

  if (server.density === null) {
    push.density = DENSITY_TO_API[local.density];
  } else {
    const serverDensity = DENSITY_FROM_API[server.density];
    if (serverDensity !== local.density) {
      apply.density = serverDensity;
    }
  }

  return { apply, push };
};
