"use client";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { Rows3, Rows4 } from "lucide-react";
import type { Density } from "@/shared/lib/density";
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
      <ToggleButton value="compact" aria-label="Компактно">
        <Tooltip title="Компактно">
          <Rows4 size={16} strokeWidth={1.75} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="default" aria-label="Обычно">
        <Tooltip title="Обычно">
          <Rows3 size={16} strokeWidth={1.75} />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
