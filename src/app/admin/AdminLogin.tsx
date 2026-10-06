import { LOCK_DURATION_MS } from "src/server/adminLoginAttempts";

import { LoginForm } from "./LoginForm";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Reads the login outcome from the URL (set by loginAction's redirect). The
// form itself is a client component only for the lockout countdown and pending
// state.
export async function AdminLogin({ searchParams }: Props) {
  const params = await searchParams;
  const raw = (name: string) => {
    const value = params[name];
    return Array.isArray(value) ? value[0] : value;
  };

  const error = raw("error");
  const retry = Number(raw("retry"));
  const retryAfterSeconds =
    Number.isFinite(retry) && retry > 0
      ? Math.min(Math.ceil(retry), LOCK_DURATION_MS / 1000)
      : undefined;

  return <LoginForm error={error} retryAfterSeconds={retryAfterSeconds} />;
}
