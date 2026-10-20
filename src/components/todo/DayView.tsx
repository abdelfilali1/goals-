import { formatDay, type Day } from "@/lib/dates";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { moveAllOverdueToToday, pushAllUnfinished } from "@/app/todo/actions";
import { QuickAdd } from "./QuickAdd";
import { DayBoard } from "./DayBoard";
import { BulkButton } from "./BulkButton";

export function DayView({
  date,
  today,
  todos,
  overdue,
  options,
}: {
  date: Day;
  today: Day;
  todos: TodoView[];
  overdue: TodoView[];
  options: ObjectiveOption[];
}) {
  const isToday = date === today;
  const carried = todos.filter((t) => t.daysPushed > 0);
  const planned = todos.filter((t) => t.daysPushed === 0);
  const unfinished = todos.filter((t) => !t.done).length;
  const dayLabel = isToday ? "today" : formatDay(date, "short");
  const empty = todos.length === 0 && overdue.length === 0;

  return (
    <div className="mt-6 flex flex-col gap-8">
      <QuickAdd day={date} options={options} dayLabel={dayLabel} />

      {empty ? (
        options.length > 0 && (
          <p className="border-t border-rule pt-6 text-muted">
            Nothing planned for {dayLabel}. Add a to-do above and link it to an objective.
          </p>
        )
      ) : (
        <div>
          <DayBoard
            today={today}
            overdue={overdue}
            carried={carried}
            planned={planned}
            plannedTitle={isToday ? "Today" : "Planned"}
            options={options}
            bringOverdue={moveAllOverdueToToday}
          />

          {unfinished > 0 && (
            <div className="mt-6">
              <BulkButton action={pushAllUnfinished.bind(null, date)}>
                Move {unfinished} unfinished to {isToday ? "tomorrow" : "the next day"}
              </BulkButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

