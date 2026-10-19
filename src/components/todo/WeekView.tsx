import Link from "next/link";
import { daysBetween, formatDay, type Day } from "@/lib/dates";
import type { ObjectiveOption, TodoView } from "@/lib/queries";
import { TodoRow } from "./TodoRow";

export function WeekView({
  from,
  to,
  today,
  todos,
  options,
}: {
  from: Day;
  to: Day;
  today: Day;
  todos: TodoView[];
  options: ObjectiveOption[];
}) {
  const days = daysBetween(from, to);
  return (
    <div className="mt-6 flex flex-col gap-8 md:gap-0">
      {days.map((day) => {
        const items = todos.filter((t) => t.dueDate === day);
        const done = items.filter((t) => t.done).length;
        const isToday = day === today;
        return (
          <section
            key={day}
            aria-label={formatDay(day, "long")}
            className="min-w-0 md:grid md:grid-cols-[160px_1fr] md:gap-6 md:border-b md:border-rule md:py-4"
          >
            <div
              className={`flex items-baseline justify-between border-b-2 pb-1 md:block md:border-0 md:pb-0 ${
                isToday ? "border-ink" : "border-rule"
              }`}
            >
              <h2>
                <Link href={`/todo?view=day&date=${day}`} className="board text-title font-extrabold hover:underline">
                  {formatDay(day, "weekday")} {day.slice(8)}.{day.slice(5, 7)}
                </Link>
                {isToday && <span className="ml-2 text-meta font-semibold text-muted">today</span>}
              </h2>
              <span className="board text-meta font-bold text-muted md:mt-1 md:block">
                {items.length > 0 ? `${done} of ${items.length} done` : ""}
              </span>
            </div>
            {items.length === 0 ? (
              <p className="py-3 text-meta text-muted">Nothing planned</p>
            ) : (
              <ul>
                {items.map((t) => (
                  <TodoRow key={t.id} todo={t} kind="planned" delay={t.daysPushed} options={options} compact />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
