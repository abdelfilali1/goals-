"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { ObjectiveOption } from "@/lib/queries";
import { ObjectivePicker, type Pick } from "@/components/ObjectivePicker";
import { addTodo } from "@/app/todo/actions";

const LAST_PICK = "compass:last-pick";

function readLastPick(options: ObjectiveOption[]): Pick {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_PICK) ?? "null") as Pick | null;
    const obj = saved && options.find((o) => o.id === saved.objectiveId);
    if (obj && obj.subObjectives.some((s) => s.id === saved.subObjectiveId)) return saved;
  } catch {
    // Storage unavailable; start empty.
  }
  return { objectiveId: "", subObjectiveId: "" };
}

export function QuickAdd({ day, options, dayLabel }: { day: string; options: ObjectiveOption[]; dayLabel: string }) {
  const [title, setTitle] = useState("");
  const [pick, setPick] = useState<Pick>({ objectiveId: "", subObjectiveId: "" });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => setPick(readLastPick(options)), [options]);

  if (options.length === 0) {
    return (
      <p className="border-y border-rule py-4 text-muted">
        To-dos are linked to an objective.{" "}
        <Link href="/objectives/new" className="font-semibold text-ink underline">
          Create your first objective
        </Link>{" "}
        to start planning.
      </p>
    );
  }

  const submit = (formData: FormData) =>
    startTransition(async () => {
      const res = await addTodo(undefined, formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      setError(undefined);
      setTitle("");
      try {
        localStorage.setItem(LAST_PICK, JSON.stringify(pick));
      } catch {
        // Not critical.
      }
      titleRef.current?.focus();
    });

  return (
    <form action={submit} onFocus={() => setOpen(true)} className="flex flex-col gap-3">
      <input type="hidden" name="day" value={day} />
      <div className="flex gap-2">
        <label htmlFor="quick-add" className="sr-only">
          New to-do for {dayLabel}
        </label>
        <input
          ref={titleRef}
          id="quick-add"
          name="title"
          className="field"
          placeholder={`Add a to-do for ${dayLabel}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={pending || !title.trim()}>
          Add
        </button>
      </div>
      {(open || title) && <ObjectivePicker options={options} value={pick} onChange={setPick} disabled={pending} />}
      {error && (
        <p role="alert" className="text-meta font-semibold text-signal">
          {error}
        </p>
      )}
    </form>
  );
}
