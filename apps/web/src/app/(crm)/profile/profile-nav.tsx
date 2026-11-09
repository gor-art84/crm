"use client";

import { Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PROFILE_LINKS = [
  { href: "/profile", label: "Профиль" },
  { href: "/profile/security", label: "Безопасность" },
  { href: "/profile/interface", label: "Интерфейс" },
] as const;

export const ProfileNav = () => {
  const pathName = usePathname();
  return (
    <Box component="nav" aria-label="Разделы профиля" sx={{ display: "flex" }}>
      {PROFILE_LINKS.map((link) => (
        <Box
          key={link.href}
          href={link.href}
          component={Link}
          aria-current={link.href === pathName ? "page" : undefined}
          sx={{
            typography: "button",
            display: "inline-flex",
            alignItems: "center",
            minHeight: 48,
            px: 2,
            py: 1.5,
            color: "text.secondary",
            textDecoration: "none",
            borderBottom: "2px solid",
            borderColor: "transparent",
            "&:hover": {
              color: "text.primary",
            },
            "&[aria-current='page']": {
              color: "primary.main",
              borderColor: "primary.main",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: -2,
            },
            transition: (theme) =>
              theme.transitions.create(["color", "border-color"], {
                duration: theme.transitions.duration.shortest,
              }),
          }}
        >
          {link.label}
        </Box>
      ))}
    </Box>
  );
};
