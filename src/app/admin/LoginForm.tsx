"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "./actions";

interface Props {
  error?: string;
  retryAfterSeconds?: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "密钥错误。",
  unconfigured: "服务端未配置 ADMIN_KEY。",
};

export function LoginForm({ error, retryAfterSeconds }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);

  // Count down locally from the server-provided relative seconds. Starts null
  // so the server-rendered markup stays quantity-free (no hydration mismatch).
  useEffect(() => {
    if (retryAfterSeconds === undefined) {
      setRemaining(null);
      return;
    }
    const deadline = Date.now() + retryAfterSeconds * 1000;
    setRemaining(retryAfterSeconds);
    const timer = setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfterSeconds]);

  const locked = error === "locked" && (remaining === null || remaining > 0);
  const lockEnded = error === "locked" && remaining === 0;

  return (
    <div className="card bg-base-100 shadow-md border border-base-content/10 max-w-md mx-auto mt-10">
      <form action={loginAction} className="card-body gap-4">
        <h1 className="card-title">管理后台</h1>
        <p className="text-sm opacity-70">请输入管理密钥以查看访问数据。</p>
        <input
          className="input input-bordered w-full"
          type="password"
          name="key"
          autoComplete="current-password"
          placeholder="管理密钥"
          disabled={locked}
          required
        />
        <SubmitButton disabled={locked} />
        {locked && (
          <div role="alert" className="alert alert-warning text-sm">
            <span>
              {remaining === null
                ? "尝试次数过多，已暂时锁定。"
                : `尝试次数过多，请在 ${Math.floor(remaining / 60)} 分 ${remaining % 60} 秒后重试。`}
            </span>
          </div>
        )}
        {lockEnded && (
          <div role="alert" className="alert alert-info text-sm">
            <span>锁定已结束，可以重试。</span>
          </div>
        )}
        {error && ERROR_MESSAGES[error] && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{ERROR_MESSAGES[error]}</span>
          </div>
        )}
      </form>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={disabled || pending}>
      {pending ? "验证中…" : "登录"}
    </button>
  );
}
