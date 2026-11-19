"use client";

import { Box, Divider, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleLabel = collapsed ? "Развернуть боковую панель" : "Свернуть боковую панель";
  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? 72 : 248,
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
            "radial-gradient(ellipse at 15% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.28), transparent 65%)",
            "radial-gradient(ellipse at 90% 85%, rgba(var(--mui-palette-primary-mainChannel) / 0.16), transparent 60%)",
          ].join(", "),
        },
        transition: (theme) =>
          theme.transitions.create("width", {
            duration: 180,
            easing: theme.transitions.easing.easeInOut,
          }),
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
    >
      <Paper
        variant="glass"
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: collapsed ? 1 : 1.5,
          gap: 1.5,
          borderRadius: "inherit",
          overflow: "hidden",
          transition: (theme) =>
            theme.transitions.create("padding", {
              duration: 180,
              easing: theme.transitions.easing.easeInOut,
            }),
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      >
        <Stack
          direction={collapsed ? "column" : "row"}
          sx={{ alignItems: "center", gap: 1.25, px: collapsed ? 0 : 1, py: 0.5, flexShrink: 0 }}
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={28}
            height={33}
            preload
            style={{ flexShrink: 0 }}
          />
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
                noWrap
              >
                Стандарт Плюс
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                Центр оценки квалификаций
              </Typography>
            </Box>
          )}

          <Tooltip title={toggleLabel}>
            <IconButton
              size="small"
              aria-label={toggleLabel}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
              sx={{ flexShrink: 0, color: "text.secondary" }}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 0.5 }}>
          <SidebarNav collapsed={collapsed} />
        </Box>

        <Divider />
        <SidebarUser collapsed={collapsed} />
      </Paper>
    </Box>
  );
};
