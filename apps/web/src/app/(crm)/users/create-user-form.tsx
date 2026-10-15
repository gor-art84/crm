import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import type { Role } from "@/generated/graphql";
import { CREATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { ROLE_LABELS } from "@/shared/model/roles";

type CreateUserFields = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: Role;
  phone?: string;
  jobTitle?: string;
};

export const CreateUserForm = () => {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFields>();

  const onSubmit = handleSubmit(async (values: CreateUserFields) => {
    try {
      await createUser({
        variables: { createUserInput: values },
        refetchQueries: [{ query: GET_USERS }],
      });
      reset();
    } catch {}
  });

  return (
    <div>
      <h2>Новый пользователь</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          autoComplete="email"
          {...register("email", { required: "Email обязателен" })}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: { value: 8, message: "Пароль должен быть не менее 8 символов" },
          })}
          placeholder="Пароль"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <input
          type="text"
          {...register("firstName", { required: "Имя обязательно" })}
          placeholder="Имя"
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <input
          type="text"
          {...register("lastName", { required: "Фамилия обязательна" })}
          placeholder="Фамилия"
        />
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <input type="text" {...register("middleName")} placeholder="Отчество" />

        <select {...register("role", { required: "Роль обязательна" })}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.role && <p>{errors.role.message}</p>}

        <input type="tel" {...register("phone")} placeholder="Телефон" />
        {error && <p>{error.message}</p>}

        <button type="submit" disabled={loading}>
          Создать пользователя
        </button>

        {loading && <p>Creating user...</p>}
      </form>
    </div>
  );
};
