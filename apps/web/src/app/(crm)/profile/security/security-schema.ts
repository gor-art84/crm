import { z } from "zod";

export const securitySchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Текущий пароль обязателен" }),
    newPassword: z
      .string()
      .min(8, { message: "Пароль должен быть не менее 8 символов" })
      .max(128, { message: "Пароль не должен превышать 128 символов" }),
    confirmPassword: z.string().min(1, { message: "Повторите пароль" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  });

export type SecuritySchema = z.infer<typeof securitySchema>;
