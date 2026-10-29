import type { z } from "zod";
import { userProfileFields } from "@/shared/model/user-profile-schema";

export const profileSchema = userProfileFields.pick({
  firstName: true,
  lastName: true,
  middleName: true,
  phone: true,
  birthDate: true,
  telegram: true,
  whatsapp: true,
  maxAccount: true,
});

export type ProfileSchema = z.infer<typeof profileSchema>;
