import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, p: 1.5, minHeight: "100dvh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TopBar />
        <Box component="main" sx={{ flex: 1, px: 1, pb: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
