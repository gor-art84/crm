"use client";

import { useQuery } from "@apollo/client/react";
import { List, ListItemButton, ListItemIcon, Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ME } from "@/shared/api/graphql/me";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

export const SidebarNav = () => {
  const { data } = useQuery(ME);
  const path = usePathname();

  if (!data) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(data.me.role));

  return (
    <List
      component="nav"
      aria-label="Основная навигация"
      disablePadding
      sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
    >
      {items.map((item) => {
        const isActive = isNavItemActive(item, path);
        const Icon = item.icon;
        return (
          <Tooltip key={item.href} title={item.label} placement="right">
            <ListItemButton
              component={Link}
              href={item.href}
              selected={isActive}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              sx={{
                borderRadius: "12px",
                "&.Mui-selected": {
                  color: "primary.contrastText",
                  bgcolor: "primary.main",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "primary.dark",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: -2,
                },
                "&.Mui-selected.Mui-focusVisible": {
                  outlineColor: "primary.contrastText",
                  outlineOffset: -4,
                },
                transition: (theme) =>
                  theme.transitions.create(["background-color", "color"], { duration: 150 }),
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
                justifyContent: "center",
                px: 0,
                gap: 0,
                minHeight: 44,
                width: 44,
                mx: "auto",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                <Icon size={18} strokeWidth={1.75} />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};
