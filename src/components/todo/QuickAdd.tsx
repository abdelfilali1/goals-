"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Repeat } from "lucide-react";
import type { ObjectiveOption } from "@/lib/queries";
import { ObjectivePicker, type Pick } from "@/components/ObjectivePicker";
import { addTodo } from "@/app/todo/actions";
import { RepeatFields, defaultRepeat, type RepeatValue } from "./RepeatFields";
import { repeatDays } from "@/lib/dates";

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
  const [repeat, setRepeat] = useState<RepeatValue | null>(null);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [pending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => setPick(readLastPick(options)), [options]);
  // A repeat starts on the day being viewed; moving to another day resets it.
  useEffect(() => setRepeat((r) => (r ? defaultRepeat(day) : r)), [day]);

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

  const count = repeat ? repeatDays(repeat.start, repeat.end, repeat.weekdays).length : 1;

  const submit = (formData: FormData) =>
    startTransition(async () => {
      const res = await addTodo(undefined, formData);
      if (res.error) {
        setError(res.error);
        setNotice(undefined);
        return;
      }
      setError(undefined);
      setNotice(res.created && res.created > 1 ? `Added ${res.created} to-dos for “${title.trim()}”.` : undefined);
      setTitle("");
      setRepeat(null);
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
          placeholder={repeat ? "Add a repeating to-do" : `Add a to-do for ${dayLabel}`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setNotice(undefined);
          }}
          autoComplete="off"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={pending || !title.trim() || count === 0}>
          {repeat && count > 1 ? `Add ${count}` : "Add"}
        </button>
      </div>

      {(open || title) && (
        <>
          <ObjectivePicker options={options} value={pick} onChange={setPick} disabled={pending} />
          <button
            type="button"
            aria-pressed={repeat !== null}
            aria-controls="repeat-fields"
            onClick={() => setRepeat((r) => (r ? null : defaultRepeat(day)))}
            className={`btn self-start border ${
              repeat ? "border-ink bg-ink text-paper" : "border-rule text-ink hover:border-ink"
            }`}
          >
            <Repeat size={18} aria-hidden />
            Repeat
          </button>
          {repeat && <RepeatFields id="repeat-fields" value={repeat} onChange={setRepeat} />}
        </>
      )}

      {error && (
        <p role="alert" className="text-meta font-semibold text-signal">
          {error}
        </p>
      )}
      <p aria-live="polite" className="text-meta font-semibold text-go empty:hidden">
        {notice}
      </p>
    </form>
  );
}
