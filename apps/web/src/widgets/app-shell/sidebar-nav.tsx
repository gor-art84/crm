"use client";

import { useQuery } from "@apollo/client/react";
import { List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ME } from "@/shared/api/graphql/me";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

type SidebarNavProps = {
  collapsed: boolean;
};

export const SidebarNav = ({ collapsed }: SidebarNavProps) => {
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
          <Tooltip key={item.href} title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              component={Link}
              href={item.href}
              selected={isActive}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              sx={{
                borderRadius: "999px",
                border: "1px solid transparent",
                "&.Mui-selected": {
                  color: "primary.main",
                  borderColor: "divider",
                  bgcolor: "action.selected",
                  backgroundImage:
                    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "action.selected",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
                transition: (theme) =>
                  theme.transitions.create(
                    ["background-color", "border-color", "box-shadow", "color"],
                    { duration: 150 },
                  ),
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 0 : 1.25,
                gap: collapsed ? 0 : 1.25,
                minHeight: collapsed ? 40 : "var(--crm-nav-h)",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                <Icon size={18} strokeWidth={1.75} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};
