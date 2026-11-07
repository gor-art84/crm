import { Divider, Paper } from "@mui/material";
import { DensitySwitcher } from "@/shared/ui/density/density-switcher";
import { ThemeModeSwitcher } from "@/shared/ui/theme/theme-mode-switcher";
import { ProfileSection } from "../profile-section";

export const InterfaceSettings = () => {
  return (
    <Paper variant="outlined">
      <ProfileSection
        title="Тема оформления"
        description="Применяется сразу, сохраняется на этом устройстве"
      >
        <ThemeModeSwitcher />
      </ProfileSection>

      <Divider />

      <ProfileSection
        title="Плотность интерфейса"
        description="Применяется сразу, сохраняется на этом устройстве"
      >
        <DensitySwitcher />
      </ProfileSection>
    </Paper>
  );
};
