import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { CATEGORY_COLORS } from "@/lib/categories";
import { CategoryManager } from "@/components/objectives/CategoryManager";
import { BackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <BackLink href="/objectives">Objectives</BackLink>
      <h1 className="board mt-2 text-board font-extrabold tracking-tight">Categories</h1>
      <p className="mt-3 max-w-prose text-muted">
        Areas of life your objectives belong to. The short code appears beside every to-do on the board.
      </p>
      <CategoryManager
        colors={CATEGORY_COLORS}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          code: c.code,
          color: c.color,
          objectives: c._count.objectives,
        }))}
      />
    </>
  );
}
