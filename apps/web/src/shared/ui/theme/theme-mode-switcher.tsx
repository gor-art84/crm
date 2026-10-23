"use client";
import { Skeleton, ToggleButton, ToggleButtonGroup, Tooltip, useColorScheme } from "@mui/material";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

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
      <ToggleButton value="system" aria-label="Как в системе">
        <Tooltip title="Как в системе">
          <Monitor size={16} strokeWidth={1.75} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="light" aria-label="Светлая тема">
        <Tooltip title="Светлая тема">
          <Sun size={16} strokeWidth={1.75} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="dark" aria-label="Тёмная тема">
        <Tooltip title="Тёмная тема">
          <Moon size={16} strokeWidth={1.75} />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
