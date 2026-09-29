import { Permission, Role } from "../generated/prisma/enums.js";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMINISTRATOR: [
    Permission.USERS_READ,
    Permission.USERS_WRITE,
    Permission.DEALS_READ,
    Permission.DEALS_WRITE,
    Permission.PROGRAMS_READ,
    Permission.PROGRAMS_WRITE,
  ],
  MANAGER: [Permission.DEALS_READ, Permission.DEALS_WRITE],
  METHODIST: [Permission.PROGRAMS_READ, Permission.PROGRAMS_WRITE],
};
