"use client";

import { useMutation } from "@apollo/client/react";
import { Divider, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import type { UpdateMyUiSettingsInput } from "@/generated/graphql";
import { UPDATE_MY_UI_SETTINGS } from "@/shared/api/graphql/profile";
import { ProfileSection } from "../profile-section";
import { DensityCards } from "./density-cards";
import { ThemeModeCards } from "./theme-mode-cards";

export const InterfaceSettings = () => {
  const [updateMyUiSettings] = useMutation(UPDATE_MY_UI_SETTINGS);
  const [saveFailed, setSaveFailed] = useState(false);

  const persist = (input: UpdateMyUiSettingsInput) => {
    updateMyUiSettings({ variables: { input } }).catch(() => setSaveFailed(true));
  };
  return (
    <>
      <Paper variant="outlined">
        <ProfileSection
          title="Тема оформления"
          description="Применяется сразу и сохраняется в профиле"
        >
          <ThemeModeCards onPersist={persist} />
        </ProfileSection>

        <Divider />

        <ProfileSection
          title="Плотность интерфейса"
          description="Применяется сразу и сохраняется в профиле"
        >
          <DensityCards onPersist={persist} />
        </ProfileSection>
      </Paper>

      <Snackbar
        open={saveFailed}
        onClose={() => setSaveFailed(false)}
        autoHideDuration={5000}
        message="Не удалось сохранить в профиле — настройка применена только на этом устройстве"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
};
