import { Box, Paper } from "@mui/material";
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
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          height: { xs: "calc(100dvh - 16px)", md: "calc(100dvh - 24px)" },
          minHeight: 0,
          overflow: "auto",
          overscrollBehaviorY: "none",
          bgcolor: "background.paper",
          borderRadius: "24px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        }}
      >
        <TopBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 2, md: 3 },
            pt: 2,
            pb: {
              xs: "calc(96px + env(safe-area-inset-bottom, 0px))",
              md: 3,
            },
          }}
        >
          {children}
        </Box>
      </Paper>
      <MobileNav />
    </Box>
  );
};
