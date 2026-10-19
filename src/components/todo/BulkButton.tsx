"use client";

import { useTransition } from "react";

/** A secondary button that runs a server action and shows it is busy. */
export function BulkButton({ action, children }: { action: () => Promise<void>; children: React.ReactNode }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-secondary w-full sm:w-auto"
      disabled={pending}
      onClick={() => startTransition(action)}
    >
      {pending ? "Moving…" : children}
    </button>
  );
}
