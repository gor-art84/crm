"use client";

import { Skeleton, useColorScheme } from "@mui/material";
import { THEME_MODE_OPTIONS } from "@/shared/ui/theme/theme-mode-options";
import { OptionCards } from "./option-cards";

export const ThemeModeCards = () => {
  const { mode, setMode } = useColorScheme();
  if (!mode) return <Skeleton variant="rounded" height={72} />;

  return (
    <OptionCards
      options={THEME_MODE_OPTIONS}
      value={mode}
      onChange={setMode}
      ariaLabel="Тема оформления"
    />
  );
};
