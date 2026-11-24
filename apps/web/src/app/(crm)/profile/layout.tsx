import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { LogoutButton } from "@/widgets/app-shell/logout-button";
import { ProfileNav } from "./profile-nav";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Box>
      <ProfileNav />
      <Box sx={{ pt: 3 }}>{children}</Box>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          mt: 3,
        }}
      >
        <LogoutButton appearance="text" />
      </Box>
    </Box>
  );
}
