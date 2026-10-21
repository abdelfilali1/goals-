import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDay, type Day } from "@/lib/dates";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { markUnfinishedMissed, moveDayToToday, pushAllUnfinished } from "@/app/todo/actions";
import { QuickAdd } from "./QuickAdd";
import { DayBoard } from "./DayBoard";
import { BulkButton } from "./BulkButton";

export function DayView({
  date,
  today,
  todos,
  unanswered,
  options,
}: {
  date: Day;
  today: Day;
  todos: TodoView[];
  /** Only on today: open to-dos still sitting on earlier days. */
  unanswered: { count: number; latestDay: Day | null } | null;
  options: ObjectiveOption[];
}) {
  const isToday = date === today;
  const isPast = date < today;
  const carried = todos.filter((t) => t.daysPushed > 0);
  const planned = todos.filter((t) => t.daysPushed === 0);
  const open = todos.filter((t) => !t.done && !t.missed).length;
  const dayLabel = isToday ? "today" : formatDay(date, "short");

  return (
    <div className="mt-6 flex flex-col gap-8">
      <QuickAdd day={date} options={options} dayLabel={dayLabel} />

      {unanswered && unanswered.count > 0 && unanswered.latestDay && (
        <p className="-mt-2 flex flex-wrap items-center gap-x-2 border-y border-rule py-3 text-meta">
          <span>
            <span className="board text-body font-extrabold text-signal">{unanswered.count}</span>{" "}
            {unanswered.count === 1 ? "to-do" : "to-dos"} from earlier days still {unanswered.count === 1 ? "has" : "have"} no
            answer. They stay on their day until you mark or move them.
          </span>
          <Link
            href={`/todo?view=day&date=${unanswered.latestDay}`}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-ink underline underline-offset-4"
          >
            Open {formatDay(unanswered.latestDay, "short")} <ArrowRight size={16} aria-hidden />
          </Link>
        </p>
      )}

      {todos.length === 0 ? (
        options.length > 0 && (
          <p className="border-t border-rule pt-6 text-muted">
            Nothing planned for {dayLabel}. Add a to-do above and link it to an objective.
          </p>
        )
      ) : (
        <div>
          <DayBoard
            past={isPast}
            carried={carried}
            planned={planned}
            plannedTitle={isToday ? "Today" : "Planned"}
            options={options}
          />

          {open > 0 && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {isPast ? (
                <BulkButton action={moveDayToToday.bind(null, date)}>Move {open} open to today</BulkButton>
              ) : (
                <BulkButton action={pushAllUnfinished.bind(null, date)}>
                  Move {open} unfinished to {isToday ? "tomorrow" : "the next day"}
                </BulkButton>
              )}
              <BulkButton action={markUnfinishedMissed.bind(null, date)} pendingLabel="Saving…">
                Mark {open} as not done
              </BulkButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
