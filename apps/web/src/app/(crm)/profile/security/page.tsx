import { Stack } from "@mui/material";
import { SessionList } from "@/app/(crm)/profile/security/session-list";
import { PasswordForm } from "./password-form";

export default function ProfileSecurityPage() {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <PasswordForm />
      <SessionList />
    </Stack>
  );
}
