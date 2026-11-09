"use client";

import { DENSITY_OPTIONS } from "@/shared/ui/density/density-options";
import { useDensity } from "@/shared/ui/density/density-provider";
import { OptionCards } from "./option-cards";

export const DensityCards = () => {
  const { density, setDensity } = useDensity();
  return (
    <OptionCards
      options={DENSITY_OPTIONS}
      value={density}
      onChange={setDensity}
      ariaLabel="Плотность интерфейса"
    />
  );
};
