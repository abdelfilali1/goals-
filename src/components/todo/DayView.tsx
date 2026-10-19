import { diffDays, formatDay, type Day } from "@/lib/dates";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { moveAllOverdueToToday, pushAllUnfinished } from "@/app/todo/actions";
import { QuickAdd } from "./QuickAdd";
import { TodoRow } from "./TodoRow";
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
          <div
            aria-hidden
            className="board grid grid-cols-[44px_1fr_auto] gap-x-3 border-b border-ink pb-2 text-meta font-bold text-muted"
          >
            <span />
            <span>To-do</span>
            <span className="flex sm:gap-3">
              <span className="w-[72px] text-right sm:w-12">Delay</span>
              <span className="hidden w-[72px] sm:block" />
            </span>
          </div>

          {overdue.length > 0 && (
            <Group
              title="Overdue"
              count={overdue.length}
              alert
              action={<BulkButton action={moveAllOverdueToToday}>Bring {overdue.length} to today</BulkButton>}
            >
              {overdue.map((t) => (
                <TodoRow key={t.id} todo={t} kind="overdue" delay={diffDays(today, t.originalDate)} options={options} />
              ))}
            </Group>
          )}

          {carried.length > 0 && (
            <Group title="Carried over" count={carried.length}>
              {carried.map((t) => (
                <TodoRow key={t.id} todo={t} kind="planned" delay={t.daysPushed} options={options} />
              ))}
            </Group>
          )}

          {planned.length > 0 && (
            <Group title={isToday ? "Today" : "Planned"} count={planned.length}>
              {planned.map((t) => (
                <TodoRow key={t.id} todo={t} kind="planned" delay={0} options={options} />
              ))}
            </Group>
          )}

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

function Group({
  title,
  count,
  alert,
  action,
  children,
}: {
  title: string;
  count: number;
  alert?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 first-of-type:mt-4" aria-label={title}>
      <div className="flex items-center justify-between gap-4 pb-1">
        <h2 className="flex items-baseline gap-2 font-bold">
          {title}
          <span className={`board text-body font-extrabold ${alert ? "text-signal" : "text-muted"}`}>{count}</span>
        </h2>
        {action && <div className="hidden sm:block">{action}</div>}
      </div>
      <ul>{children}</ul>
      {action && <div className="mt-3 sm:hidden">{action}</div>}
    </section>
  );
}
