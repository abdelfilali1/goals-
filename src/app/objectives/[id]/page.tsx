import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { fromDb, formatDay } from "@/lib/dates";
import { getToday } from "@/lib/today";
import { getTodosForObjective } from "@/lib/queries";
import { getObjectiveProgress } from "@/lib/progress";
import { CodePlate } from "@/components/CodePlate";
import { ProgressBar } from "@/components/ProgressBar";
import { BackLink } from "@/components/BackLink";
import { Delay } from "@/components/todo/Delay";
import { ObjectiveActions } from "@/components/objectives/ObjectiveActions";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const o = await db.objective.findUnique({ where: { id }, select: { title: true } });
  return { title: o?.title ?? "Objective" };
}

export default async function ObjectivePage({ params }: Params) {
  const { id } = await params;
  const today = await getToday();
  const [[objective], record, todos] = await Promise.all([
    getObjectiveProgress(today, { objectiveId: id }),
    db.objective.findUnique({ where: { id }, select: { targetDate: true } }),
    getTodosForObjective(id),
  ]);
  if (!objective || !record) notFound();

  return (
    <>
      <BackLink href="/objectives">Objectives</BackLink>
      <header className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-title font-bold">{objective.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-meta text-muted">
            <CodePlate code={objective.category.code} color={objective.category.color} />
            {objective.category.name}
            {record.targetDate && <span>· Target {formatDay(fromDb(record.targetDate), "long")}</span>}
            {objective.archived && <span className="font-semibold text-ink">· Archived</span>}
          </p>
        </div>
        <Link href={`/objectives/${id}/edit`} className="btn btn-secondary">
          <Pencil size={16} aria-hidden /> Edit
        </Link>
      </header>

      {objective.description && <p className="mt-6 max-w-prose whitespace-pre-line">{objective.description}</p>}

      <section className="mt-10" aria-labelledby="overall">
        <h2 id="overall" className="border-b-2 border-ink pb-2 font-bold">
          Overall
        </h2>
        <div className="py-4">
          <ProgressBar progress={objective.progress} label="Overall progress" />
        </div>
      </section>

      <section className="mt-6" aria-labelledby="subs">
        <h2 id="subs" className="border-b-2 border-ink pb-2 font-bold">
          Sub-objectives
        </h2>
        <ul>
          {objective.subObjectives.map((s) => (
            <li key={s.id} className="grid gap-2 border-b border-rule py-3 md:grid-cols-[1fr_280px] md:gap-6">
              <span className="font-semibold">{s.title}</span>
              <ProgressBar progress={s.progress} label={`${s.title} progress`} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="recent">
        <h2 id="recent" className="border-b-2 border-ink pb-2 font-bold">
          Recent to-dos
        </h2>
        {todos.length === 0 ? (
          <p className="py-4 text-muted">
            No to-dos yet.{" "}
            <Link href="/todo" className="font-semibold text-ink underline">
              Plan one on the To-do page
            </Link>
            .
          </p>
        ) : (
          <ul>
            {todos.map((t) => (
              <li key={t.id} className="grid grid-cols-[64px_1fr_auto] items-baseline gap-3 border-b border-rule py-3">
                <Link href={`/todo?view=day&date=${t.dueDate}`} className="board font-bold text-muted hover:text-ink hover:underline">
                  {t.dueDate.slice(8)}.{t.dueDate.slice(5, 7)}
                </Link>
                <span className="min-w-0">
                  <span className={t.done ? "text-muted line-through" : "font-semibold"}>{t.title}</span>
                  <span className="block text-meta text-muted">
                    {t.subObjective.title}
                    {t.done ? " · done" : t.missed ? " · not done" : t.dueDate < today ? " · no answer" : ""}
                  </span>
                </span>
                <Delay days={t.daysPushed} muted={t.done} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ObjectiveActions id={id} archived={objective.archived} title={objective.title} />
    </>
  );
}
