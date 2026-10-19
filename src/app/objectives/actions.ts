"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CATEGORY_COLORS, cleanCode, deriveCode } from "@/lib/categories";
import { isDay, toDb } from "@/lib/dates";

export type ActionResult = { error?: string };

export type ObjectiveInput = {
  title: string;
  description: string;
  categoryId: string;
  targetDate: string | null;
  /** Existing sub-objectives keep their id; new ones have none. */
  subObjectives: { id?: string; title: string }[];
};

function refresh() {
  revalidatePath("/objectives", "layout");
  revalidatePath("/todo");
  revalidatePath("/progress");
}

function validate(input: ObjectiveInput): string | null {
  if (!input.title.trim()) return "Give the objective a title.";
  if (!input.categoryId) return "Pick a category.";
  if (input.targetDate && !isDay(input.targetDate)) return "The target date is not valid.";
  const subs = input.subObjectives.filter((s) => s.title.trim());
  if (subs.length === 0) return "Add at least one sub-objective. To-dos are linked to one.";
  return null;
}

export async function createObjective(input: ObjectiveInput): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { error };

  const objective = await db.objective.create({
    data: {
      title: input.title.trim(),
      description: input.description.trim(),
      categoryId: input.categoryId,
      targetDate: input.targetDate ? toDb(input.targetDate) : null,
      subObjectives: {
        create: input.subObjectives
          .filter((s) => s.title.trim())
          .map((s, i) => ({ title: s.title.trim(), sortOrder: i })),
      },
    },
  });
  refresh();
  redirect(`/objectives/${objective.id}`);
}

export async function updateObjective(id: string, input: ObjectiveInput): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { error };

  const subs = input.subObjectives.filter((s) => s.title.trim());
  const keepIds = subs.flatMap((s) => (s.id ? [s.id] : []));

  // Removing a sub-objective that still has to-dos would delete those to-dos, so refuse.
  const removedWithTodos = await db.subObjective.findFirst({
    where: { objectiveId: id, id: { notIn: keepIds }, todos: { some: {} } },
  });
  if (removedWithTodos) {
    return {
      error: `"${removedWithTodos.title}" still has to-dos. Move or delete them before removing it.`,
    };
  }

  await db.$transaction([
    db.subObjective.deleteMany({ where: { objectiveId: id, id: { notIn: keepIds } } }),
    db.objective.update({
      where: { id },
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        categoryId: input.categoryId,
        targetDate: input.targetDate ? toDb(input.targetDate) : null,
      },
    }),
    ...subs.map((s, i) =>
      s.id
        ? db.subObjective.update({ where: { id: s.id }, data: { title: s.title.trim(), sortOrder: i } })
        : db.subObjective.create({ data: { objectiveId: id, title: s.title.trim(), sortOrder: i } }),
    ),
  ]);
  refresh();
  return {};
}

export async function setArchived(id: string, archived: boolean) {
  await db.objective.update({ where: { id }, data: { archived } });
  refresh();
}

export async function deleteObjective(id: string) {
  await db.objective.delete({ where: { id } });
  refresh();
  redirect("/objectives");
}

export async function createCategory(name: string, color?: string): Promise<ActionResult & { id?: string }> {
  const clean = name.trim();
  if (!clean) return { error: "Give the category a name." };
  if (await db.category.findUnique({ where: { name: clean } })) {
    return { error: `"${clean}" already exists.` };
  }
  const count = await db.category.count();
  const category = await db.category.create({
    data: {
      name: clean,
      code: deriveCode(clean),
      color: color ?? CATEGORY_COLORS[count % CATEGORY_COLORS.length],
      sortOrder: count,
    },
  });
  refresh();
  return { id: category.id };
}

export async function updateCategory(
  id: string,
  data: { name: string; code: string; color: string },
): Promise<ActionResult> {
  const clean = data.name.trim();
  if (!clean) return { error: "Give the category a name." };
  const clash = await db.category.findFirst({ where: { name: clean, id: { not: id } } });
  if (clash) return { error: `"${clean}" already exists.` };
  await db.category.update({
    where: { id },
    data: { name: clean, code: cleanCode(data.code, clean), color: data.color },
  });
  refresh();
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const used = await db.objective.count({ where: { categoryId: id } });
  if (used > 0) {
    return { error: `This category has ${used} objective${used === 1 ? "" : "s"}. Move them first.` };
  }
  await db.category.delete({ where: { id } });
  refresh();
  return {};
}
