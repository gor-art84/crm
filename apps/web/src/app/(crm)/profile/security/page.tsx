import { Stack } from "@mui/material";
import { OtherSessions } from "./other-sessions";
import { PasswordForm } from "./password-form";

export default function ProfileSecurityPage() {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <PasswordForm />
      <OtherSessions />
    </Stack>
  );
}
