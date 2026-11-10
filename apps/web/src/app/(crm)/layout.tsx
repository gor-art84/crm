import type { ReactNode } from "react";
import { UiSettingsSync } from "@/shared/ui/ui-settings/ui-settings-sync";
import { AppShell } from "@/widgets/app-shell";

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <UiSettingsSync />
      {children}
    </AppShell>
  );
}
