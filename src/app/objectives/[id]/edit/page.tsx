import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fromDb } from "@/lib/dates";
import { getCategories } from "@/lib/queries";
import { ObjectiveForm } from "@/components/objectives/ObjectiveForm";
import { BackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Edit objective" };

export default async function EditObjectivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [objective, categories] = await Promise.all([
    db.objective.findUnique({ where: { id }, include: { subObjectives: { orderBy: { sortOrder: "asc" } } } }),
    getCategories(),
  ]);
  if (!objective) notFound();

  return (
    <>
      <BackLink href={`/objectives/${id}`}>{objective.title}</BackLink>
      <h1 className="board mt-2 text-board font-extrabold tracking-tight">Edit objective</h1>
      <ObjectiveForm
        objectiveId={id}
        categories={categories.map((c) => ({ id: c.id, name: c.name, code: c.code }))}
        initial={{
          title: objective.title,
          description: objective.description,
          categoryId: objective.categoryId,
          targetDate: objective.targetDate ? fromDb(objective.targetDate) : null,
          subObjectives: objective.subObjectives.map((s) => ({ id: s.id, title: s.title })),
        }}
      />
    </>
  );
}
