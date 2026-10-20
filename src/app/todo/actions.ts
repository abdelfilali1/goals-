"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { MAX_REPEAT_DAYS, addDays, diffDays, fromDb, isDay, repeatDays, toDb } from "@/lib/dates";
import { getToday } from "@/lib/today";

export type ActionResult = { error?: string; created?: number };

function refresh() {
  revalidatePath("/todo");
  revalidatePath("/progress");
  revalidatePath("/objectives", "layout");
}

async function checkLink(objectiveId: string, subObjectiveId: string) {
  const sub = await db.subObjective.findUnique({ where: { id: subObjectiveId } });
  return sub !== null && sub.objectiveId === objectiveId;
}

export async function addTodo(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const objectiveId = String(formData.get("objectiveId") ?? "");
  const subObjectiveId = String(formData.get("subObjectiveId") ?? "");
  const day = String(formData.get("day") ?? "");

  if (!title) return { error: "Give the to-do a title." };
  if (!objectiveId || !subObjectiveId) return { error: "Pick an objective and a sub-objective." };
  if (!(await checkLink(objectiveId, subObjectiveId))) {
    return { error: "That sub-objective belongs to a different objective." };
  }

  if (formData.get("repeat") === "on") {
    const start = String(formData.get("startDate") ?? "");
    const end = String(formData.get("endDate") ?? "");
    const weekdays = formData
      .getAll("weekday")
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
    if (!isDay(start) || !isDay(end)) return { error: "Choose a start date and an end date." };
    if (end < start) return { error: "The end date is before the start date." };
    if (diffDays(end, start) > MAX_REPEAT_DAYS) return { error: "A repeat can cover one year at most." };
    if (weekdays.length === 0) return { error: "Pick at least one day of the week." };
    const days = repeatDays(start, end, weekdays);
    if (days.length === 0) return { error: "None of the chosen days fall between those dates." };

    // Each occurrence is an ordinary to-do, so ticking, pushing and progress work per day.
    await db.series.create({
      data: {
        title,
        objectiveId,
        subObjectiveId,
        startDate: toDb(start),
        endDate: toDb(end),
        weekdays: [...new Set(weekdays)].sort(),
        todos: {
          create: days.map((d) => ({ title, objectiveId, subObjectiveId, originalDate: toDb(d), dueDate: toDb(d) })),
        },
      },
    });
    refresh();
    return { created: days.length };
  }

  if (!isDay(day)) return { error: "That date is not valid." };
  await db.todo.create({
    data: { title, objectiveId, subObjectiveId, originalDate: toDb(day), dueDate: toDb(day) },
  });
  refresh();
  return { created: 1 };
}

/** Unfinished occurrences of the same series from this to-do's day on, including itself. */
async function upcomingInSeries(id: string) {
  const todo = await db.todo.findUnique({ where: { id } });
  if (!todo?.seriesId) return null;
  return { seriesId: todo.seriesId, where: { seriesId: todo.seriesId, done: false, dueDate: { gte: todo.dueDate } } };
}

export async function updateTodo(
  id: string,
  data: { title: string; objectiveId: string; subObjectiveId: string },
  applyToUpcoming = false,
): Promise<ActionResult> {
  const title = data.title.trim();
  if (!title) return { error: "Give the to-do a title." };
  if (!(await checkLink(data.objectiveId, data.subObjectiveId))) {
    return { error: "That sub-objective belongs to a different objective." };
  }
  const fields = { title, objectiveId: data.objectiveId, subObjectiveId: data.subObjectiveId };
  const upcoming = applyToUpcoming ? await upcomingInSeries(id) : null;
  if (upcoming) {
    await db.$transaction([
      db.todo.update({ where: { id }, data: fields }),
      db.todo.updateMany({ where: upcoming.where, data: fields }),
      db.series.update({ where: { id: upcoming.seriesId }, data: fields }),
    ]);
  } else {
    await db.todo.update({ where: { id }, data: fields });
  }
  refresh();
  return {};
}

export async function setDone(id: string, done: boolean) {
  await db.todo.update({
    where: { id },
    data: { done, completedAt: done ? new Date() : null },
  });
  refresh();
}

/** Moves one unfinished to-do forward by a day. */
export async function pushTodo(id: string) {
  const todo = await db.todo.findUnique({ where: { id } });
  if (!todo || todo.done) return;
  await db.todo.update({
    where: { id },
    data: { dueDate: toDb(addDays(fromDb(todo.dueDate), 1)), pushCount: { increment: 1 } },
  });
  refresh();
}

/** Moves every unfinished to-do due on `day` to the following day. */
export async function pushAllUnfinished(day: string) {
  if (!isDay(day)) return;
  await db.$executeRaw`
    UPDATE "Todo"
    SET "dueDate" = "dueDate" + 1, "pushCount" = "pushCount" + 1
    WHERE "done" = false AND "dueDate" = ${toDb(day)}::date`;
  refresh();
}

/** Brings an overdue to-do (due before today) onto today's list. */
export async function moveToToday(id: string) {
  const today = await getToday();
  const todo = await db.todo.findUnique({ where: { id } });
  if (!todo || todo.done || fromDb(todo.dueDate) >= today) return;
  await db.todo.update({
    where: { id },
    data: { dueDate: toDb(today), pushCount: { increment: 1 } },
  });
  refresh();
}

/** Brings every overdue to-do onto today's list. */
export async function moveAllOverdueToToday() {
  const today = toDb(await getToday());
  await db.$executeRaw`
    UPDATE "Todo"
    SET "dueDate" = ${today}::date, "pushCount" = "pushCount" + 1
    WHERE "done" = false AND "dueDate" < ${today}::date`;
  refresh();
}

/** Deletes one to-do, or with "upcoming" every unfinished occurrence of its series from this day on. */
export async function deleteTodo(id: string, scope: "one" | "upcoming" = "one") {
  const upcoming = scope === "upcoming" ? await upcomingInSeries(id) : null;
  if (upcoming) {
    await db.todo.deleteMany({ where: upcoming.where });
    await db.todo.deleteMany({ where: { id } });
    // Drop the series once nothing is left in it.
    if ((await db.todo.count({ where: { seriesId: upcoming.seriesId } })) === 0) {
      await db.series.delete({ where: { id: upcoming.seriesId } });
    }
  } else {
    await db.todo.delete({ where: { id } });
  }
  refresh();
}
