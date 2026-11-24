"use client";

import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

export const TopBar = () => {
  const path = usePathname();
  const currentItem = NAV_ITEMS.find((item) => isNavItemActive(item, path));
  const title = currentItem?.label ?? (path.startsWith("/profile") ? "Профиль" : undefined);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: { xs: 2, md: 3 },
        bgcolor: "background.paper",
        borderRadius: "23px 23px 0 0",
      }}
    >
      {title && (
        <Typography variant="h4" component="h1" noWrap sx={{ minWidth: 0 }}>
          {title}
        </Typography>
      )}
    </Box>
  );
};
