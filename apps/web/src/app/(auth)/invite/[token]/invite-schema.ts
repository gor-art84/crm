import { z } from "zod";

export const inviteSchema = z
  .object({
    password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
    confirmPassword: z.string().min(1, { message: "Повторите пароль" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type InviteSchema = z.infer<typeof inviteSchema>;
