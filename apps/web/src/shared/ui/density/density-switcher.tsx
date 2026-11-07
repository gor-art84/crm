"use client";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import type { Density } from "@/shared/lib/density";
import { DENSITY_OPTIONS } from "./density-options";
import { useDensity } from "./density-provider";

export const DensitySwitcher = () => {
  const { density, setDensity } = useDensity();
  const handleDensityChange = (_e: React.MouseEvent<HTMLElement>, value: Density | null) => {
    if (value === null) return;
    setDensity(value);
  };
  return (
    <ToggleButtonGroup
      value={density}
      exclusive
      onChange={handleDensityChange}
      size="small"
      aria-label="Плотность интерфейса"
    >
      {DENSITY_OPTIONS.map(({ value, label, Icon }) => (
        <ToggleButton key={value} value={value} aria-label={label}>
          <Tooltip title={label}>
            <Icon size={16} strokeWidth={1.75} />
          </Tooltip>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
