"use client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import type { Role } from "@/generated/graphql";
import { ME } from "@/shared/api/graphql/me";

const ITEMS: { href: string; label: string; roles: Role[] }[] = [
  {
    href: "/",
    label: "Home",
    roles: ["ADMINISTRATOR", "MANAGER", "METHODIST"],
  },
  {
    href: "/deals",
    label: "Deals",
    roles: ["ADMINISTRATOR", "MANAGER", "METHODIST"],
  },
  {
    href: "/programs",
    label: "Programs",
    roles: ["ADMINISTRATOR", "METHODIST"],
  },
  {
    href: "/users",
    label: "Users",
    roles: ["ADMINISTRATOR"],
  },
];

export function AppNav() {
  const { data, error } = useQuery(ME);
  if (error || !data?.me) {
    return null;
  }
  return (
    <nav>
      <ul>
        {ITEMS.filter((item) => item.roles.includes(data.me.role)).map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
