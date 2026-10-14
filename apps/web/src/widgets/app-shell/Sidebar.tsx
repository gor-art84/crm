import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { SidebarNav } from "./SidebarNav";
import { SidebarUser } from "./SidebarUser";

export const Sidebar = () => {
  return (
    <Paper
      variant="glass"
      component="aside"
      sx={{
        width: 248,
        flexShrink: 0,
        position: "sticky",
        top: 12,
        height: "calc(100dvh - 24px)",
        display: "flex",
        flexDirection: "column",
        p: 1.5,
        gap: 1.5,
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1.25, px: 1, py: 0.5 }}>
        <Image
          src="/brand/logo.png"
          alt=""
          width={28}
          height={33}
          preload
          style={{ flexShrink: 0 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.04em",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            Стандарт Плюс
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
            Центр оценки квалификаций
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <SidebarNav />
      </Box>

      <Divider />
      <SidebarUser />
    </Paper>
  );
};
