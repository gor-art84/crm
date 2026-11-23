import { Box, Divider, Paper, Stack } from "@mui/material";
import Image from "next/image";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export const Sidebar = () => {
  return (
    <Box
      component="aside"
      sx={{
        width: 64,
        flexShrink: 0,
        position: "sticky",
        top: 12,
        height: "calc(100dvh - 24px)",
        display: { xs: "none", md: "block" },
        borderRadius: "24px",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: [
            "radial-gradient(ellipse at 15% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.08), transparent 65%)",
            "radial-gradient(ellipse at 90% 85%, rgba(var(--mui-palette-primary-mainChannel) / 0.04), transparent 60%)",
          ].join(", "),
        },
      }}
    >
      <Paper
        variant="glass"
        sx={{
          width: "100%",
          boxSizing: "border-box",
          p: 0.5,
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          borderRadius: "inherit",
          overflow: "hidden",
          "&&": {
            boxShadow: [
              "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              "0 4px 16px rgba(0, 0, 0, 0.04)",
            ].join(", "),
          },
        }}
      >
        <Stack sx={{ alignItems: "center", py: 1, flexShrink: 0 }}>
          <Image
            src="/brand/logo.png"
            alt="Стандарт Плюс"
            width={32}
            height={38}
            preload
            style={{ flexShrink: 0 }}
          />
        </Stack>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            p: 0,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <SidebarNav />
        </Box>

        <Divider />
        <SidebarUser />
      </Paper>
    </Box>
  );
};
