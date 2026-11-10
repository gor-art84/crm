import { useMutation } from "@apollo/client/react";
import { useColorScheme } from "@mui/material";
import { UPDATE_MY_UI_SETTINGS } from "@/shared/api/graphql/profile";
import { reconcileUiSettings, type ServerUiSettings } from "@/shared/lib/ui-settings";
import { useDensity } from "@/shared/ui/density/density-provider";

export const useApplyUiSettings = () => {
  const { mode, setMode } = useColorScheme();
  const { density, setDensity } = useDensity();
  const [updateMyUiSettings] = useMutation(UPDATE_MY_UI_SETTINGS);
  const isReady = mode !== undefined;

  const applyUiSettings = (server: ServerUiSettings) => {
    if (!isReady) return;

    const { apply, push } = reconcileUiSettings({ themeMode: mode, density }, server);
    if (apply.themeMode) setMode(apply.themeMode);
    if (apply.density) setDensity(apply.density);
    if (Object.keys(push).length > 0)
      updateMyUiSettings({ variables: { input: push } }).catch(() => {
        // seed повторится при следующем старте сессии — сервер всё ещё null
      });
  };

  return { isReady, applyUiSettings };
};
