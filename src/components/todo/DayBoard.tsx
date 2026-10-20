"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowUpDown } from "lucide-react";
import { diffDays, type Day } from "@/lib/dates";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { reorderTodos } from "@/app/todo/actions";
import { TodoRow } from "./TodoRow";
import { BulkButton } from "./BulkButton";

type GroupDef = {
  key: string;
  title: string;
  todos: TodoView[];
  kind: "planned" | "overdue";
  alert?: boolean;
  action?: React.ReactNode;
};

/** The day's board: sections of to-do rows, with a reorder mode that swaps the push controls for arrows. */
export function DayBoard({
  today,
  overdue,
  carried,
  planned,
  plannedTitle,
  options,
  bringOverdue,
}: {
  today: Day;
  overdue: TodoView[];
  carried: TodoView[];
  planned: TodoView[];
  plannedTitle: string;
  options: ObjectiveOption[];
  bringOverdue: () => Promise<void>;
}) {
  const [reordering, setReordering] = useState(false);
  const total = overdue.length + carried.length + planned.length;

  const groups: GroupDef[] = [
    {
      key: "overdue",
      title: "Overdue",
      todos: overdue,
      kind: "overdue",
      alert: true,
      action: <BulkButton action={bringOverdue}>Bring {overdue.length} to today</BulkButton>,
    },
    { key: "carried", title: "Carried over", todos: carried, kind: "planned" },
    { key: "planned", title: plannedTitle, todos: planned, kind: "planned" },
  ];

  return (
    <div>
      {total > 1 && (
        <div className="-mt-4 mb-1 flex justify-end">
          <button
            type="button"
            onClick={() => setReordering((r) => !r)}
            aria-pressed={reordering}
            className={`inline-flex h-11 items-center gap-2 rounded px-3 text-meta font-semibold ${
              reordering ? "bg-ink text-paper" : "text-ink hover:bg-wash"
            }`}
          >
            <ArrowUpDown size={16} aria-hidden />
            {reordering ? "Done reordering" : "Reorder"}
          </button>
        </div>
      )}
      <div
        aria-hidden
        className="board grid grid-cols-[44px_1fr_auto] gap-x-3 border-b border-ink pb-2 text-meta font-bold text-muted"
      >
        <span />
        <span>To-do</span>
        {reordering ? (
          <span className="w-[88px] text-center">Order</span>
        ) : (
          <span className="flex sm:gap-3">
            <span className="w-[72px] text-right sm:w-12">Delay</span>
            <span className="hidden w-[72px] sm:block" />
          </span>
        )}
      </div>

      {groups.map(
        (g) =>
          g.todos.length > 0 && (
            <Group key={g.key} def={g} today={today} options={options} reordering={reordering} />
          ),
      )}
    </div>
  );
}

function Group({
  def,
  today,
  options,
  reordering,
}: {
  def: GroupDef;
  today: Day;
  options: ObjectiveOption[];
  reordering: boolean;
}) {
  const incoming = def.todos.map((t) => t.id).join(",");
  const [order, setOrder] = useState(def.todos.map((t) => t.id));
  const [, startTransition] = useTransition();
  // Follow the server whenever the set or order of to-dos changes.
  useEffect(() => setOrder(incoming ? incoming.split(",") : []), [incoming]);

  const byId = new Map(def.todos.map((t) => [t.id, t]));
  const rows = order.map((id) => byId.get(id)).filter((t): t is TodoView => Boolean(t));

  const move = (index: number, by: -1 | 1) => {
    const next = rows.map((t) => t.id);
    [next[index], next[index + by]] = [next[index + by], next[index]];
    setOrder(next);
    startTransition(() => reorderTodos(next));
  };

  return (
    <section className="mt-6 first-of-type:mt-4" aria-label={def.title}>
      <div className="flex items-center justify-between gap-4 pb-1">
        <h2 className="flex items-baseline gap-2 font-bold">
          {def.title}
          <span className={`board text-body font-extrabold ${def.alert ? "text-signal" : "text-muted"}`}>
            {rows.length}
          </span>
        </h2>
        {def.action && !reordering && <div className="hidden sm:block">{def.action}</div>}
      </div>
      <ul>
        {rows.map((t, i) => (
          <TodoRow
            key={t.id}
            todo={t}
            kind={def.kind}
            delay={def.kind === "overdue" ? diffDays(today, t.originalDate) : t.daysPushed}
            options={options}
            reorder={
              reordering
                ? {
                    onUp: i > 0 ? () => move(i, -1) : undefined,
                    onDown: i < rows.length - 1 ? () => move(i, 1) : undefined,
                  }
                : undefined
            }
          />
        ))}
      </ul>
      {def.action && !reordering && <div className="mt-3 sm:hidden">{def.action}</div>}
    </section>
  );
}
