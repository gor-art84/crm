"use client";

import { Box, Paper, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { ThemeModeSwitcher } from "@/shared/ui/theme/theme-mode-switcher";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

export const TopBar = () => {
  const path = usePathname();
  const currentItem = NAV_ITEMS.find((item) => isNavItemActive(item, path));
  const title = currentItem?.label;

  return (
    <Paper
      variant="glass"
      component="header"
      sx={{
        position: "sticky",
        top: 12,
        zIndex: (theme) => theme.zIndex.appBar,
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2.5,
      }}
    >
      {title && (
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      )}
      <Box sx={{ flex: 1 }} />
      <ThemeModeSwitcher />
    </Paper>
  );
};
