"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LOGIN } from "@/shared/api/graphql/login";

type LoginFields = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();

  const [login, { loading, error }] = useMutation(LOGIN);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const onSubmit = handleSubmit(async (values: LoginFields) => {
    try {
      await login({ variables: { input: values } });
      router.push(`/`);
    } catch {}
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
