"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LOGIN } from "@/shared/api/graphql/login";
import { useApplyUiSettings } from "@/shared/ui/ui-settings/use-apply-ui-settings";

type LoginFields = {
  email: string;
  password: string;
};

type LoginFormProps = {
  next: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const { applyUiSettings } = useApplyUiSettings();

  const [login, { loading, error }] = useMutation(LOGIN);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const onSubmit = handleSubmit(async (values: LoginFields) => {
    try {
      const { data } = await login({ variables: { input: values } });
      if (data) applyUiSettings(data.login);
      router.replace(next);
    } catch {
      // ошибка отображается через error из useMutation
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        autoComplete="username"
        {...register("email", { required: "Email is required" })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}
      <input
        type="password"
        autoComplete="current-password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
