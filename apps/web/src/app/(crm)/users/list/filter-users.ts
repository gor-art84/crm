import type { GetUsersQuery, Role } from "@/generated/graphql";
import { formatFullName } from "@/shared/lib/person-name";
import { ROLE_LABELS } from "@/shared/model/roles";

export type UsersFiltersType = {
  q: string;
  role: Role | "";
  status: "" | "active" | "inactive";
};

export const parseUsersFilters = (params: URLSearchParams): UsersFiltersType => {
  const q = params.get("q") ?? "";
  const roleParam = params.get("role");
  const role = roleParam && roleParam in ROLE_LABELS ? (roleParam as Role) : "";
  const statusParam = params.get("status");
  const status = statusParam === "active" || statusParam === "inactive" ? statusParam : "";
  return { q, role, status };
};

export const usersFiltersToSearchParams = (filters: UsersFiltersType): URLSearchParams => {
  const params = new URLSearchParams();
  const q = filters.q.trim();
  if (q) params.set("q", q);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  return params;
};

export const filterUsers = (
  users: GetUsersQuery["users"],
  filters: UsersFiltersType,
): GetUsersQuery["users"] => {
  const needle = filters.q.trim().toLowerCase();

  return users.filter((user) => {
    if (needle) {
      const name = formatFullName(user).toLowerCase();
      const email = user.email.toLowerCase();
      if (!name.includes(needle) && !email.includes(needle)) {
        return false;
      }
    }

    if (filters.role && user.role !== filters.role) {
      return false;
    }

    if (filters.status === "active" && !user.isActive) {
      return false;
    }
    if (filters.status === "inactive" && user.isActive) {
      return false;
    }

    return true;
  });
};
