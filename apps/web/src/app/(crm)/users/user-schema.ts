import { z } from "zod";
import { normalizeRuPhone } from "@/shared/lib/phone-ru";

export const userProfileFields = z.object({
  email: z.email({ message: "Email не валидный" }),
  firstName: z.string().min(1, { message: "Имя должно быть не пустым" }),
  lastName: z.string().min(1, { message: "Фамилия должна быть не пустой" }),
  middleName: z.string(),
  role: z.enum(["ADMINISTRATOR", "METHODIST", "MANAGER"]),
  phone: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") return;
      if (!normalizeRuPhone(value)) {
        ctx.addIssue({
          code: "custom",
          message: "Номер телефона не валидный",
        });
      }
    })
    .transform((value) => {
      if (value === "") return "";
      // сюда дойдём только если superRefine прошёл
      return normalizeRuPhone(value) ?? "";
    }),
});

export const createUserSchema = userProfileFields.extend({
  password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
});

export const editUserSchema = userProfileFields.extend({
  password: z.string(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type EditUserSchema = z.infer<typeof editUserSchema>;
