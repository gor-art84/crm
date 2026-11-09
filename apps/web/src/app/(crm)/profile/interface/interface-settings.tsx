import { Divider, Paper } from "@mui/material";
import { ProfileSection } from "../profile-section";
import { DensityCards } from "./density-cards";
import { ThemeModeCards } from "./theme-mode-cards";

export const InterfaceSettings = () => {
  return (
    <Paper variant="outlined">
      <ProfileSection
        title="Тема оформления"
        description="Применяется сразу, сохраняется на этом устройстве"
      >
        <ThemeModeCards />
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Плотность интерфейса"
        description="Применяется сразу, сохраняется на этом устройстве"
      >
        <DensityCards />
      </ProfileSection>
    </Paper>
  );
};
