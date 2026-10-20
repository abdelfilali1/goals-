"use client";

import { useOptimistic, useState, useTransition } from "react";
import { ArrowRight, Check, ChevronDown, ChevronUp, CornerDownLeft, Repeat, Trash2 } from "lucide-react";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { CodePlate } from "@/components/CodePlate";
import { ObjectivePicker, type Pick } from "@/components/ObjectivePicker";
import { deleteTodo, moveToToday, pushTodo, setDone, updateSeriesSchedule, updateTodo } from "@/app/todo/actions";
import { RepeatFields, type RepeatValue } from "./RepeatFields";
import { Delay } from "./Delay";

type Props = {
  todo: TodoView;
  /** Delay to show; for overdue items this counts up to today. */
  delay: number;
  kind: "planned" | "overdue";
  options: ObjectiveOption[];
  compact?: boolean;
  /** When set, the row shows up/down arrows instead of its delay and push controls. */
  reorder?: { onUp?: () => void; onDown?: () => void };
};

export function TodoRow({ todo, delay, kind, options, compact, reorder }: Props) {
  const [done, setOptimisticDone] = useOptimistic(todo.done);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const boxId = `todo-${todo.id}`;

  const toggle = (checked: boolean) =>
    startTransition(async () => {
      setOptimisticDone(checked);
      await setDone(todo.id, checked);
    });

  const move = () =>
    startTransition(async () => {
      if (kind === "overdue") await moveToToday(todo.id);
      else await pushTodo(todo.id);
    });

  if (editing) {
    return <EditRow todo={todo} options={options} onClose={() => setEditing(false)} />;
  }

  const status =
    done && delay === 0 ? (
      <span className="inline-flex text-go" title="Done">
        <Check size={20} strokeWidth={3} aria-hidden />
        <span className="sr-only">Done</span>
      </span>
    ) : (
      <Delay days={delay} muted={done} />
    );

  return (
    <li
      className={`grid items-start gap-x-3 border-b border-rule transition-opacity ${
        compact ? "grid-cols-[22px_1fr_auto] py-2.5" : "grid-cols-[44px_1fr_auto] py-1.5"
      } ${pending ? "opacity-50" : ""}`}
    >
      <div className={compact ? "pt-0.5" : "flex h-11 items-center justify-center"}>
        <input
          id={boxId}
          type="checkbox"
          className="tick"
          checked={done}
          onChange={(e) => toggle(e.target.checked)}
          aria-describedby={`${boxId}-path`}
        />
      </div>

      <div className={`min-w-0 ${compact ? "" : "py-2"}`}>
        {compact ? (
          <label htmlFor={boxId} className={`block cursor-pointer ${done ? "text-muted line-through" : "font-semibold"}`}>
            {todo.title}
          </label>
        ) : (
          <>
            <label htmlFor={boxId} className="sr-only">
              {todo.title}
            </label>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`block text-left hover:underline ${done ? "text-muted line-through" : "font-semibold"}`}
            >
              {todo.title}
            </button>
          </>
        )}
        {/* The objective gives way first so the sub-objective always shows. */}
        <p id={`${boxId}-path`} className="mt-1 flex min-w-0 items-center gap-2 text-meta text-muted">
          <CodePlate code={todo.category.code} color={todo.category.color} name={todo.category.name} />
          {todo.repeats && (
            <span className="flex-none text-ink" title="Repeats">
              <Repeat size={14} strokeWidth={2.5} aria-hidden />
              <span className="sr-only">Repeats.</span>
            </span>
          )}
          <span className="flex min-w-0 gap-1">
            <span className="truncate">{todo.objective.title}</span>
            <span className="max-w-[65%] flex-none truncate">› {todo.subObjective.title}</span>
          </span>
        </p>
      </div>

      {reorder ? (
        <div className="flex items-center">
          <button
            type="button"
            className="icon-btn disabled:opacity-30"
            onClick={reorder.onUp}
            disabled={!reorder.onUp}
            aria-label={`Move “${todo.title}” up`}
          >
            <ChevronUp size={20} aria-hidden />
          </button>
          <button
            type="button"
            className="icon-btn disabled:opacity-30"
            onClick={reorder.onDown}
            disabled={!reorder.onDown}
            aria-label={`Move “${todo.title}” down`}
          >
            <ChevronDown size={20} aria-hidden />
          </button>
        </div>
      ) : compact ? (
        <div className="pt-0.5 text-right">{status}</div>
      ) : (
        // Phone: delay stacked over the push control so the title keeps the width.
        // Wider: delay and push sit side by side as two board columns.
        <div className="flex w-[72px] flex-col items-end sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex h-8 items-center justify-end sm:h-11 sm:w-12">{status}</div>
          <div className="flex h-11 w-[72px] items-center justify-center">
          {!done && (
            <button
              type="button"
              onClick={move}
              disabled={pending}
              className="board inline-flex h-11 w-full items-center justify-end gap-1 rounded text-body font-extrabold hover:bg-wash sm:justify-center"
              aria-label={kind === "overdue" ? `Move “${todo.title}” to today` : `Move “${todo.title}” to the next day`}
              title={kind === "overdue" ? "Move to today" : "Move to the next day"}
            >
              {kind === "overdue" ? (
                <>
                  <CornerDownLeft size={18} aria-hidden /> Today
                </>
              ) : (
                <>
                  Next <ArrowRight size={18} aria-hidden />
                </>
              )}
            </button>
          )}
          </div>
        </div>
      )}
    </li>
  );
}

function EditRow({ todo, options, onClose }: { todo: TodoView; options: ObjectiveOption[]; onClose: () => void }) {
  const [title, setTitle] = useState(todo.title);
  const [pick, setPick] = useState<Pick>({ objectiveId: todo.objective.id, subObjectiveId: todo.subObjective.id });
  const [error, setError] = useState<string>();
  const [alsoUpcoming, setAlsoUpcoming] = useState(false);
  const series = todo.series;
  const [schedule, setSchedule] = useState<RepeatValue | null>(
    series ? { start: series.start, end: series.end, weekdays: series.weekdays } : null,
  );
  const [pending, startTransition] = useTransition();
  const scheduleChanged =
    series !== null &&
    schedule !== null &&
    (schedule.start !== series.start ||
      schedule.end !== series.end ||
      schedule.weekdays.length !== series.weekdays.length ||
      !schedule.weekdays.every((d) => series.weekdays.includes(d)));

  // An archived objective is not in the options; keep it selectable while editing.
  const withCurrent = options.some((o) => o.id === todo.objective.id)
    ? options
    : [
        ...options,
        {
          id: todo.objective.id,
          title: todo.objective.title,
          category: todo.category,
          subObjectives: [todo.subObjective],
        },
      ];

  const save = () =>
    startTransition(async () => {
      const res = await updateTodo(todo.id, { title, ...pick }, todo.repeats && alsoUpcoming);
      if (res.error) {
        setError(res.error);
        return;
      }
      // Title and objective first, so days the new schedule adds use the updated details.
      if (series && schedule && scheduleChanged) {
        const sched = await updateSeriesSchedule(series.id, schedule);
        if (sched.error) {
          setError(sched.error);
          return;
        }
      }
      onClose();
    });

  const remove = (scope: "one" | "upcoming") =>
    startTransition(async () => {
      const what =
        scope === "upcoming"
          ? `Delete “${todo.title}” on this day and every unfinished repeat after it?`
          : `Delete “${todo.title}”${todo.repeats ? " on this day only" : ""}?`;
      if (!window.confirm(`${what} This cannot be undone.`)) return;
      await deleteTodo(todo.id, scope);
    });

  return (
    <li className="border-b border-rule py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="flex flex-col gap-3"
      >
        <label className="flex flex-col gap-1">
          <span className="text-meta font-semibold text-muted">To-do</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
        </label>
        <ObjectivePicker options={withCurrent} value={pick} onChange={setPick} disabled={pending} />
        {todo.repeats && (
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 accent-ink"
              checked={alsoUpcoming}
              onChange={(e) => setAlsoUpcoming(e.target.checked)}
            />
            <span>Also change the unfinished repeats after this day</span>
          </label>
        )}
        {schedule && (
          <section aria-label="Repeat schedule" className="flex flex-col gap-1">
            <h3 className="mt-2 flex items-center gap-2 font-bold">
              <Repeat size={16} strokeWidth={2.5} aria-hidden /> Repeat schedule
            </h3>
            <p className="text-meta text-muted">
              Changes apply from today. Days already done or in the past stay as they are.
            </p>
            <RepeatFields id={`schedule-${todo.id}`} value={schedule} onChange={setSchedule} editing />
          </section>
        )}
        {error && (
          <p role="alert" className="text-meta font-semibold text-signal">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            Save
          </button>
          <button type="button" className="btn btn-quiet" onClick={onClose}>
            Cancel
          </button>
          <span className="ml-auto flex flex-wrap gap-2">
            <button type="button" className="btn btn-quiet" onClick={() => remove("one")} disabled={pending}>
              <Trash2 size={18} aria-hidden /> {todo.repeats ? "Delete this day" : "Delete"}
            </button>
            {todo.repeats && (
              <button type="button" className="btn btn-quiet" onClick={() => remove("upcoming")} disabled={pending}>
                Delete upcoming repeats
              </button>
            )}
          </span>
        </div>
      </form>
    </li>
  );
}
