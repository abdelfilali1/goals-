"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { addDays, fromDb, isDay, toDb } from "@/lib/dates";
import { getToday } from "@/lib/today";

export type ActionResult = { error?: string };

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
  if (!isDay(day)) return { error: "That date is not valid." };
  if (!(await checkLink(objectiveId, subObjectiveId))) {
    return { error: "That sub-objective belongs to a different objective." };
  }

  await db.todo.create({
    data: { title, objectiveId, subObjectiveId, originalDate: toDb(day), dueDate: toDb(day) },
  });
  refresh();
  return {};
}

export async function updateTodo(
  id: string,
  data: { title: string; objectiveId: string; subObjectiveId: string },
): Promise<ActionResult> {
  const title = data.title.trim();
  if (!title) return { error: "Give the to-do a title." };
  if (!(await checkLink(data.objectiveId, data.subObjectiveId))) {
    return { error: "That sub-objective belongs to a different objective." };
  }
  await db.todo.update({
    where: { id },
    data: { title, objectiveId: data.objectiveId, subObjectiveId: data.subObjectiveId },
  });
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

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } });
  refresh();
}
