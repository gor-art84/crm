import type { UpdateMyUiSettingsInput } from "@/generated/graphql";
import type { Density } from "@/shared/lib/density";
import { DENSITY_TO_API } from "@/shared/lib/ui-settings";
import { DENSITY_OPTIONS } from "@/shared/ui/density/density-options";
import { useDensity } from "@/shared/ui/density/density-provider";
import { OptionCards } from "./option-cards";

type DensityCardsProps = {
  onPersist: (input: UpdateMyUiSettingsInput) => void;
};

export const DensityCards = ({ onPersist }: DensityCardsProps) => {
  const { density, setDensity } = useDensity();

  const handleChange = (next: Density) => {
    setDensity(next);
    onPersist({ density: DENSITY_TO_API[next] });
  };

  return (
    <OptionCards
      options={DENSITY_OPTIONS}
      value={density}
      onChange={handleChange}
      ariaLabel="Плотность интерфейса"
    />
  );
};
