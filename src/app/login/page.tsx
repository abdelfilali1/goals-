import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Unlock" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-sm flex-col justify-center py-16">
      <h1 className="board text-board font-extrabold">Compass</h1>
      <p className="mt-3 text-muted">Daily progress against the objectives you set.</p>
      <LoginForm />
    </div>
  );
}
