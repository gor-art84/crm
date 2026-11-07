"use client";
import { Skeleton, ToggleButton, ToggleButtonGroup, Tooltip, useColorScheme } from "@mui/material";
import { THEME_MODE_OPTIONS, type ThemeMode } from "./theme-mode-options";

export const ThemeModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  if (!mode) return <Skeleton variant="rounded" width={94} height={32} />;
  const handleModeChange = (_e: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value === null) return;
    setMode(value);
  };
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeChange}
      size="small"
      aria-label="Тема оформления"
    >
      {THEME_MODE_OPTIONS.map(({ value, label, Icon }) => (
        <ToggleButton key={value} value={value} aria-label={label}>
          <Tooltip title={label}>
            <Icon size={16} strokeWidth={1.75} />
          </Tooltip>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
