"use client";

import { useQuery } from "@apollo/client/react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
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
      sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
    >
      {items.map((item) => {
        const isActive = isNavItemActive(item, path);
        const Icon = item.icon;
        return (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={isActive}
            aria-current={isActive ? "page" : undefined}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
              <Icon size={18} strokeWidth={1.75} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
    </List>
  );
};
