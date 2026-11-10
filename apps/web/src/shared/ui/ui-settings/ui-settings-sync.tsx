"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { ME } from "@/shared/api/graphql/me";
import { useApplyUiSettings } from "./use-apply-ui-settings";

export const UiSettingsSync = () => {
  const { data } = useQuery(ME);
  const { isReady, applyUiSettings } = useApplyUiSettings();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!data || !isReady) return;
    if (syncedRef.current) return;

    syncedRef.current = true;

    applyUiSettings(data.me);
  }, [data, isReady, applyUiSettings]);

  return null;
};
