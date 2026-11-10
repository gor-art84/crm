import { Skeleton, useColorScheme } from "@mui/material";
import type { UpdateMyUiSettingsInput } from "@/generated/graphql";
import { THEME_MODE_TO_API } from "@/shared/lib/ui-settings";
import { THEME_MODE_OPTIONS, type ThemeMode } from "@/shared/ui/theme/theme-mode-options";
import { OptionCards } from "./option-cards";

type ThemeModeCardsProps = {
  onPersist: (input: UpdateMyUiSettingsInput) => void;
};

export const ThemeModeCards = ({ onPersist }: ThemeModeCardsProps) => {
  const { mode, setMode } = useColorScheme();
  if (!mode) return <Skeleton variant="rounded" height={72} />;

  const handleChange = (next: ThemeMode) => {
    setMode(next);
    onPersist({ themeMode: THEME_MODE_TO_API[next] });
  };

  return (
    <OptionCards
      options={THEME_MODE_OPTIONS}
      value={mode}
      onChange={handleChange}
      ariaLabel="Тема оформления"
    />
  );
};
