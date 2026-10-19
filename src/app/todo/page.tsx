import type { Metadata } from "next";
import { addDays, addMonths, endOfMonth, formatDay, isDay, startOfMonth, startOfWeek } from "@/lib/dates";
import { getToday } from "@/lib/today";
import { getObjectiveOptions, getOverdue, getTodosBetween } from "@/lib/queries";
import { BoardHeader, type View } from "@/components/todo/BoardHeader";
import { DayView } from "@/components/todo/DayView";
import { WeekView } from "@/components/todo/WeekView";
import { MonthView } from "@/components/todo/MonthView";

export const metadata: Metadata = { title: "To-do" };

const short = (d: string) => `${d.slice(8)}.${d.slice(5, 7)}`;

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const today = await getToday();
  const view: View = params.view === "week" || params.view === "month" ? params.view : "day";
  const date = isDay(params.date) ? params.date : today;
  const options = await getObjectiveOptions();

  if (view === "week") {
    const from = startOfWeek(date);
    const to = addDays(from, 6);
    const todos = await getTodosBetween(from, to);
    return (
      <>
        <BoardHeader
          view={view}
          date={date}
          title={`${short(from)}–${short(to)}`}
          done={todos.filter((t) => t.done).length}
          total={todos.length}
          prev={addDays(from, -7)}
          next={addDays(from, 7)}
          today={today}
          showToday={today < from || today > to}
        />
        <WeekView from={from} to={to} today={today} todos={todos} options={options} />
      </>
    );
  }

  if (view === "month") {
    const first = startOfMonth(date);
    const last = endOfMonth(date);
    // The grid shows whole weeks, so load the spill-over days too.
    const todos = await getTodosBetween(startOfWeek(first), addDays(startOfWeek(last), 6));
    const inMonth = todos.filter((t) => t.dueDate >= first && t.dueDate <= last);
    return (
      <>
        <BoardHeader
          view={view}
          date={date}
          title={formatDay(first, "month")}
          done={inMonth.filter((t) => t.done).length}
          total={inMonth.length}
          prev={addMonths(first, -1)}
          next={addMonths(first, 1)}
          today={today}
          showToday={today.slice(0, 7) !== first.slice(0, 7)}
        />
        <MonthView date={date} today={today} todos={todos} />
      </>
    );
  }

  const [todos, overdue] = await Promise.all([
    getTodosBetween(date, date),
    date === today ? getOverdue(today) : Promise.resolve([]),
  ]);
  const note =
    date === today ? "today" : date === addDays(today, -1) ? "yesterday" : date === addDays(today, 1) ? "tomorrow" : undefined;

  return (
    <>
      <BoardHeader
        view={view}
        date={date}
        title={`${formatDay(date, "weekday")} ${short(date)}`}
        note={note}
        done={todos.filter((t) => t.done).length}
        total={todos.length}
        prev={addDays(date, -1)}
        next={addDays(date, 1)}
        today={today}
        showToday={date !== today}
      />
      <DayView date={date} today={today} todos={todos} overdue={overdue} options={options} />
    </>
  );
}
