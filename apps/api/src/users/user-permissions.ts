import { ROLE_PERMISSIONS } from "../auth/role-permissions.js";
import { Permission, Role } from "../generated/prisma/enums.js";

export const filterPermissionsBeyondRole = (
  role: Role,
  permissions: Permission[],
): Permission[] => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return [...new Set(permissions)].filter((permission) => !rolePermissions.includes(permission));
};
