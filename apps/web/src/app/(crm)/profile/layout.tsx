import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { ProfileNav } from "./profile-nav";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Box>
      <ProfileNav />
      <Box sx={{ pt: 3 }}>{children}</Box>
    </Box>
  );
}
