import Link from "next/link";
import { addDays, daysBetween, endOfMonth, formatDay, startOfMonth, startOfWeek, type Day } from "@/lib/dates";
import type { TodoView } from "@/lib/queries";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({ date, today, todos }: { date: Day; today: Day; todos: TodoView[] }) {
  const first = startOfMonth(date);
  const last = endOfMonth(date);
  const gridStart = startOfWeek(first);
  const gridEnd = addDays(startOfWeek(last), 6);
  const month = first.slice(0, 7);

  return (
    <div className="mt-6">
      <div aria-hidden className="board grid grid-cols-7 border-b border-ink pb-2 text-meta font-bold text-muted">
        {WEEKDAYS.map((d) => (
          <span key={d} className="px-1.5">
            {d}
          </span>
        ))}
      </div>
      <ol className="grid grid-cols-7">
        {daysBetween(gridStart, gridEnd).map((day) => {
          const items = todos.filter((t) => t.dueDate === day);
          const done = items.filter((t) => t.done).length;
          const pushed = items.filter((t) => t.daysPushed > 0 && !t.done && !t.missed).length;
          const inMonth = day.slice(0, 7) === month;
          const pct = items.length ? (done / items.length) * 100 : 0;
          const label = `${formatDay(day, "long")}: ${items.length ? `${done} of ${items.length} done` : "nothing planned"}${
            pushed ? `, ${pushed} pushed` : ""
          }`;
          return (
            <li key={day} className="border-b border-rule">
              <Link
                href={`/todo?view=day&date=${day}`}
                aria-label={label}
                className={`flex h-20 flex-col gap-1.5 px-1.5 pt-1.5 hover:bg-wash md:h-24 ${inMonth ? "" : "text-muted opacity-50"}`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`board inline-flex h-7 min-w-7 items-center justify-center rounded-plate text-body font-extrabold ${
                      day === today ? "bg-ink text-paper" : ""
                    }`}
                  >
                    {Number(day.slice(8))}
                  </span>
                  {pushed > 0 && (
                    <span className="board text-meta font-extrabold text-signal" aria-hidden>
                      +{pushed}
                    </span>
                  )}
                </span>
                {items.length > 0 && (
                  <>
                    <span className="block h-1 w-full overflow-hidden rounded-full bg-wash" aria-hidden>
                      <span className="block h-full bg-go" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="board hidden text-meta font-bold text-muted md:block" aria-hidden>
                      {done}/{items.length}
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 flex items-center gap-2 text-meta text-muted">
        <span className="board font-extrabold text-signal">+N</span> counts unfinished to-dos pushed onto that day.
      </p>
    </div>
  );
}
