import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";
import { getToday } from "@/lib/today";
import { getCategories } from "@/lib/queries";
import { getObjectiveProgress, type ObjectiveProgress } from "@/lib/progress";
import { CodePlate } from "@/components/CodePlate";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = { title: "Objectives" };

export default async function ObjectivesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: filter } = await searchParams;
  const today = await getToday();
  const [categories, objectives] = await Promise.all([getCategories(), getObjectiveProgress(today)]);

  const active = objectives.filter((o) => !o.archived && (!filter || o.category.id === filter));
  const archived = objectives.filter((o) => o.archived && (!filter || o.category.id === filter));
  const shown = categories.filter((c) => !filter || c.id === filter);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 pt-2 md:pt-10">
        <h1 className="board text-board font-extrabold tracking-tight">Objectives</h1>
        <div className="flex gap-2">
          <Link href="/objectives/categories" className="btn btn-quiet">
            <Settings2 size={18} aria-hidden /> Categories
          </Link>
          <Link href="/objectives/new" className="btn btn-primary">
            <Plus size={18} aria-hidden /> New objective
          </Link>
        </div>
      </header>

      <nav aria-label="Filter by category" className="mt-6 -mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2 pb-1">
          <li>
            <Chip href="/objectives" active={!filter}>
              All
            </Chip>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Chip href={`/objectives?category=${c.id}`} active={filter === c.id}>
                <CodePlate code={c.code} color={c.color} />
                {c.name}
              </Chip>
            </li>
          ))}
        </ul>
      </nav>

      {objectives.length === 0 ? (
        <div className="mt-10 border-t-2 border-ink pt-6">
          <p className="text-title font-bold">No objectives yet</p>
          <p className="mt-2 max-w-prose text-muted">
            An objective is something you are working toward, like running a half marathon or saving an emergency fund.
            Break it into sub-objectives, then plan daily to-dos against them.
          </p>
          <Link href="/objectives/new" className="btn btn-primary mt-6">
            <Plus size={18} aria-hidden /> Create your first objective
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {shown.map((c) => {
            const items = active.filter((o) => o.category.id === c.id);
            if (filter === undefined && items.length === 0) return null;
            return (
              <section key={c.id} aria-labelledby={`cat-${c.id}`}>
                <h2 id={`cat-${c.id}`} className="flex items-center gap-3 border-b-2 border-ink pb-2 text-title font-bold">
                  <CodePlate code={c.code} color={c.color} size="md" />
                  {c.name}
                  <span className="board ml-auto text-meta font-bold text-muted">
                    {items.length} objective{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                {items.length === 0 ? (
                  <p className="py-4 text-muted">
                    No objectives in {c.name} yet.{" "}
                    <Link href={`/objectives/new?category=${c.id}`} className="font-semibold text-ink underline">
                      Add one
                    </Link>
                  </p>
                ) : (
                  <ul>
                    {items.map((o) => (
                      <ObjectiveRow key={o.id} objective={o} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {archived.length > 0 && (
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold text-muted">
                Archived <span className="board font-bold">{archived.length}</span>
              </summary>
              <ul className="mt-2">
                {archived.map((o) => (
                  <ObjectiveRow key={o.id} objective={o} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </>
  );
}

function ObjectiveRow({ objective: o }: { objective: ObjectiveProgress }) {
  return (
    <li className="border-b border-rule">
      <Link href={`/objectives/${o.id}`} className="grid gap-x-6 gap-y-2 py-4 hover:bg-wash md:grid-cols-[1fr_280px] md:px-2">
        <div className="min-w-0">
          <p className="font-bold">{o.title}</p>
          {o.description && <p className="mt-0.5 line-clamp-1 text-meta text-muted">{o.description}</p>}
          <p className="mt-1 text-meta text-muted">
            {o.subObjectives.length} sub-objective{o.subObjectives.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="self-center">
          <ProgressBar progress={o.progress} label={`${o.title} progress`} />
        </div>
      </Link>
    </li>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-2 whitespace-nowrap rounded border px-3 text-meta font-semibold ${
        active ? "border-ink bg-ink text-paper" : "border-rule text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}
