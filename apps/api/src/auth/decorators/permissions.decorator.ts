import { SetMetadata } from "@nestjs/common";
import { Permission } from "../../generated/prisma/enums.js";

export const PERMISSIONS_KEYS = "permissions";

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEYS, permissions);
