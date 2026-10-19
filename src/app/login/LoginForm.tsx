"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-10 flex flex-col gap-3">
      <label htmlFor="password" className="font-semibold">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="field"
        aria-invalid={state?.error ? true : undefined}
        aria-describedby={state?.error ? "login-error" : undefined}
      />
      {state?.error && (
        <p id="login-error" role="alert" className="text-meta font-semibold text-signal">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-2" disabled={pending}>
        {pending ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
