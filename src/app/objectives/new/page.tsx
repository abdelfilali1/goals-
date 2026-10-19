import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { ObjectiveForm } from "@/components/objectives/ObjectiveForm";
import { BackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "New objective" };

export default async function NewObjectivePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const preset = categories.find((c) => c.id === category)?.id ?? "";
  return (
    <>
      <BackLink href="/objectives">Objectives</BackLink>
      <h1 className="board mt-2 text-board font-extrabold tracking-tight">New objective</h1>
      <ObjectiveForm
        categories={categories.map((c) => ({ id: c.id, name: c.name, code: c.code }))}
        initial={preset ? { title: "", description: "", categoryId: preset, targetDate: null, subObjectives: [] } : undefined}
      />
    </>
  );
}
