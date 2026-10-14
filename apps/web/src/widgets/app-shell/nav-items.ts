import { GraduationCap, Handshake, House, type LucideIcon, Users } from "lucide-react";
import type { Role } from "@/generated/graphql";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Главная",
    icon: House,
    roles: ["ADMINISTRATOR", "MANAGER", "METHODIST"],
  },
  {
    href: "/deals",
    label: "Сделки",
    icon: Handshake,
    roles: ["ADMINISTRATOR", "MANAGER", "METHODIST"],
  },
  {
    href: "/programs",
    label: "Программы",
    icon: GraduationCap,
    roles: ["ADMINISTRATOR", "METHODIST"],
  },
  {
    href: "/users",
    label: "Пользователи",
    icon: Users,
    roles: ["ADMINISTRATOR"],
  },
];

const isNavItemActive = (item: NavItem, path: string): boolean => {
  if (item.href === "/") {
    return path === "/";
  }
  return path === item.href || path.startsWith(`${item.href}/`);
};

export { isNavItemActive, NAV_ITEMS, type NavItem };
