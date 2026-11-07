import { safeNext } from "@/shared/lib/safe-next";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  return (
    <div>
      <LoginForm next={safeNext(next)} />
    </div>
  );
}
