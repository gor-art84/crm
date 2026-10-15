import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email({ message: "Email не валидный" }),
  password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
  firstName: z.string().min(1, { message: "Имя должно быть не пустым" }),
  lastName: z.string().min(1, { message: "Фамилия должна быть не пустой" }),
  middleName: z.string(),
  role: z.enum(["ADMINISTRATOR", "METHODIST", "MANAGER"]),
  phone: z.string(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
