"use client";
import { Box, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const PROFILE_TABS = [
  { href: "/profile", label: "Профиль" },
  { href: "/profile/security", label: "Безопасность" },
  { href: "/profile/interface", label: "Интерфейс" },
] as const;

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname();

  return (
    <Box>
      <Tabs value={pathName} aria-label="Разделы профиля">
        {PROFILE_TABS.map((tab) => (
          <Tab key={tab.href} label={tab.label} href={tab.href} value={tab.href} component={Link} />
        ))}
      </Tabs>
      <Box sx={{ pt: 3 }}>{children}</Box>
    </Box>
  );
}
