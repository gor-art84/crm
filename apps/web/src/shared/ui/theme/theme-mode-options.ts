import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react";

export type ThemeModeOption = {
  value: string;
  label: string;
  description?: string;
  Icon: LucideIcon;
};

export const THEME_MODE_OPTIONS = [
  {
    value: "system",
    label: "Системная тема",
    description: "Следует настройке macOS/Windows",
    Icon: Monitor,
  },
  { value: "light", label: "Светлая тема", Icon: Sun },
  { value: "dark", label: "Тёмная тема", Icon: Moon },
] as const satisfies readonly ThemeModeOption[];

export type ThemeMode = (typeof THEME_MODE_OPTIONS)[number]["value"];
