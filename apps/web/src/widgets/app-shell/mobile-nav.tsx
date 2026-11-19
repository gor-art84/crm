"use client";

import { useQuery } from "@apollo/client/react";
import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ME } from "@/shared/api/graphql/me";
import { isNavItemActive, NAV_ITEMS } from "@/widgets/app-shell/nav-items";

export const MobileNav = () => {
  const { data } = useQuery(ME);
  const path = usePathname();

  if (!data) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(data.me.role));
  const isProfileActive = path === "/profile" || path.startsWith("/profile/");

  return (
    <Paper
      variant="glass"
      sx={{
        display: {
          xs: "block",
          md: "none",
        },
        position: "fixed",
        left: 8,
        right: 8,
        bottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
        zIndex: (theme) => theme.zIndex.appBar,
        p: 0.75,
      }}
    >
      <Box component="nav" aria-label="Основная навигация" sx={{ display: "flex" }}>
        {items.map((item) => {
          const isActive = isNavItemActive(item, path);
          const Icon = item.icon;

          return (
            <ButtonBase
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                flex: 1,
                minWidth: 0,
                minHeight: 56,
                flexDirection: "column",
                gap: 0.5,
                borderRadius: 2,
                color: isActive ? "primary.main" : "text.secondary",
                bgcolor: isActive ? "action.selected" : "transparent",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden />
              <Typography
                component="span"
                variant="caption"
                noWrap
                sx={{
                  maxWidth: "100%",
                  px: 0.25,
                  fontSize: 10,
                }}
              >
                {item.mobileLabel ?? item.label}
              </Typography>
            </ButtonBase>
          );
        })}
        <ButtonBase
          component={Link}
          href="/profile"
          aria-current={isProfileActive ? "page" : undefined}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 56,
            flexDirection: "column",
            gap: 0.5,
            borderRadius: 2,
            bgcolor: isProfileActive ? "action.selected" : "transparent",
            color: isProfileActive ? "primary.main" : "text.secondary",
          }}
        >
          <UserRound size={20} strokeWidth={1.75} aria-hidden />
          <Typography
            component="span"
            variant="caption"
            noWrap
            sx={{ maxWidth: "100%", px: 0.25, fontSize: 10 }}
          >
            Профиль
          </Typography>
        </ButtonBase>
      </Box>
    </Paper>
  );
};
