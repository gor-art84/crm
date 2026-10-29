import type { z } from "zod";
import { userProfileFields } from "@/shared/model/user-profile-schema";

export const createUserSchema = userProfileFields;

export const editUserSchema = userProfileFields;

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type EditUserSchema = z.infer<typeof editUserSchema>;
