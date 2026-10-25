import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { addDays, isDay, startOfWeek, toDb } from "@/lib/dates";
import { getToday } from "@/lib/today";
import { getWeekScores } from "@/lib/progress";
import { CodePlate } from "@/components/CodePlate";
import { ProgressBar } from "@/components/ProgressBar";
import { WeekNotes } from "@/components/recap/WeekNotes";

export const metadata: Metadata = { title: "Weekly recap" };

const short = (d: string) => `${d.slice(8)}.${d.slice(5, 7)}`;
const href = (week: string) => `/recap?week=${week}`;

export default async function RecapPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const params = await searchParams;
  const today = await getToday();
  const thisWeek = startOfWeek(today);
  const week = startOfWeek(isDay(params.week) ? params.week : today);
  const end = addDays(week, 6);

  const [{ overall, byCategory }, note] = await Promise.all([
    getWeekScores(week, today),
    db.weekNote.findUnique({ where: { weekStart: toDb(week) } }),
  ]);

  return (
    <>
      <header className="pt-2 md:pt-10">
        <div className="flex items-end justify-between gap-4">
          <h1 className="board text-board font-extrabold tracking-tight">
            {short(week)}–{short(end)}
            {week === thisWeek && (
              <span className="ml-2 align-middle text-body font-semibold tracking-normal text-muted">this week</span>
            )}
          </h1>
          <p className="board pb-1 text-right text-body font-bold text-muted">
            {overall.total ? (
              <>
                <span className="text-ink">{overall.pct}%</span> · {overall.done} of {overall.total} done
              </>
            ) : (
              "Nothing due yet"
            )}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-b-2 border-ink">
          <p className="flex h-11 items-center font-semibold">Weekly recap</p>
          <div className="flex items-center">
            {week !== thisWeek && (
              <Link href={href(thisWeek)} className="btn btn-quiet h-11 px-3 text-meta">
                This week
              </Link>
            )}
            <Link href={href(addDays(week, -7))} className="icon-btn" aria-label="Previous week" title="Previous week">
              <ChevronLeft size={20} aria-hidden />
            </Link>
            <Link href={href(addDays(week, 7))} className="icon-btn -mr-3" aria-label="Next week" title="Next week">
              <ChevronRight size={20} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <Section title="Score by category">
        <ul>
          {byCategory.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 border-b border-rule py-3 md:grid-cols-[auto_200px_1fr]"
            >
              <CodePlate code={c.code} color={c.color} />
              <span className="font-semibold">{c.name}</span>
              <div className="col-span-2 md:col-span-1">
                <ProgressBar progress={c.progress} label={`${c.name} score for the week`} />
              </div>
            </li>
          ))}
        </ul>
        {week > thisWeek ? (
          <p className="mt-3 text-meta text-muted">This week hasn&rsquo;t started yet, so nothing counts toward it.</p>
        ) : week === thisWeek ? (
          <p className="mt-3 text-meta text-muted">Counts to-dos due from Monday up to today.</p>
        ) : null}
      </Section>

      <Section title="Notes">
        <WeekNotes key={week} week={week} initial={note?.notes ?? ""} />
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 border-b-2 border-ink pb-2 font-bold">{title}</h2>
      {children}
    </section>
  );
}
