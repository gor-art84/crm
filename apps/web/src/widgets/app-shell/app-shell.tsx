import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { MobileNav } from "@/widgets/app-shell/mobile-nav";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{ display: "flex", gap: { xs: 1, md: 1.5 }, p: { xs: 1, md: 1.5 }, minHeight: "100dvh" }}
    >
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TopBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            px: 1,
            pb: {
              xs: "calc(96px + env(safe-area-inset-bottom, 0px))",
              md: 1,
            },
          }}
        >
          {children}
        </Box>
      </Box>
      <MobileNav />
    </Box>
  );
};
