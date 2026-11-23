import { Box, Stack, Typography } from "@mui/material";
import type { StatusTone } from "@/shared/ui/status-chip";

type UserStatusProps = {
  label: string;
  tone: StatusTone;
};

const DOT_COLORS: Record<StatusTone, string> = {
  success: "success.main",
  warning: "warning.main",
  error: "error.main",
  neutral: "text.disabled",
};

export const UserStatus = ({ label, tone }: UserStatusProps) => (
  <Stack direction="row" sx={{ alignItems: "center", gap: 1, minWidth: 0 }}>
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        flexShrink: 0,
        bgcolor: DOT_COLORS[tone],
      }}
    />
    <Typography variant="body2" sx={{ minWidth: 0, color: "text.secondary" }}>
      {label}
    </Typography>
  </Stack>
);
