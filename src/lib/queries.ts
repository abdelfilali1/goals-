import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import { ensureDefaultCategories } from "./categories";
import { diffDays, fromDb, toDb, type Day } from "./dates";

export type TodoView = {
  id: string;
  title: string;
  done: boolean;
  dueDate: Day;
  originalDate: Day;
  pushCount: number;
  /** How many days the to-do has slipped since it was first planned. */
  daysPushed: number;
  objective: { id: string; title: string };
  subObjective: { id: string; title: string };
  category: { id: string; name: string; code: string; color: string };
};

const todoInclude = {
  objective: { include: { category: true } },
  subObjective: true,
} as const;

type TodoRow = Awaited<ReturnType<typeof loadTodos>>[number];

function loadTodos(where: Prisma.TodoWhereInput) {
  return db.todo.findMany({ where, include: todoInclude, orderBy: [{ createdAt: "asc" }] });
}

function toView(t: TodoRow): TodoView {
  const dueDate = fromDb(t.dueDate);
  const originalDate = fromDb(t.originalDate);
  return {
    id: t.id,
    title: t.title,
    done: t.done,
    dueDate,
    originalDate,
    pushCount: t.pushCount,
    daysPushed: diffDays(dueDate, originalDate),
    objective: { id: t.objective.id, title: t.objective.title },
    subObjective: { id: t.subObjective.id, title: t.subObjective.title },
    category: {
      id: t.objective.category.id,
      name: t.objective.category.name,
      code: t.objective.category.code,
      color: t.objective.category.color,
    },
  };
}

export async function getTodosBetween(from: Day, to: Day) {
  const rows = await loadTodos({ dueDate: { gte: toDb(from), lte: toDb(to) } });
  return rows.map(toView);
}

/** Unfinished to-dos whose day has already passed. */
export async function getOverdue(today: Day) {
  const rows = await loadTodos({ done: false, dueDate: { lt: toDb(today) } });
  return rows.map(toView).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getTodosForObjective(objectiveId: string, take = 15) {
  const rows = await db.todo.findMany({
    where: { objectiveId },
    include: todoInclude,
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
    take,
  });
  return rows.map(toView);
}

export type ObjectiveOption = {
  id: string;
  title: string;
  category: { id: string; name: string; code: string; color: string };
  subObjectives: { id: string; title: string }[];
};

/** Active objectives with their sub-objectives, for pickers. */
export async function getObjectiveOptions(): Promise<ObjectiveOption[]> {
  const rows = await db.objective.findMany({
    where: { archived: false },
    include: { category: true, subObjectives: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ category: { sortOrder: "asc" } }, { createdAt: "asc" }],
  });
  return rows.map((o) => ({
    id: o.id,
    title: o.title,
    category: { id: o.category.id, name: o.category.name, code: o.category.code, color: o.category.color },
    subObjectives: o.subObjectives.map((s) => ({ id: s.id, title: s.title })),
  }));
}

export async function getCategories() {
  await ensureDefaultCategories(db);
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { objectives: true } } },
  });
}
