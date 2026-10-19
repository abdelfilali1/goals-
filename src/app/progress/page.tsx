import type { Metadata } from "next";
import Link from "next/link";
import { getToday } from "@/lib/today";
import { getProgressOverview } from "@/lib/progress";
import { CodePlate } from "@/components/CodePlate";
import { ProgressBar } from "@/components/ProgressBar";
import { CumulativeChart, DailyChart } from "@/components/progress/Charts";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  const today = await getToday();
  const { overall, thisWeek, carriedOver, byCategory, objectives, days } = await getProgressOverview(today);
  const active = objectives.filter((o) => !o.archived);

  return (
    <>
      <header className="pt-2 md:pt-10">
        <h1 className="board text-board font-extrabold tracking-tight">Progress</h1>
        {overall.total === 0 ? (
          <p className="mt-4 max-w-prose text-muted">
            Progress appears once you have planned to-dos and their day has arrived. Future to-dos never count against you.{" "}
            <Link href="/todo" className="font-semibold text-ink underline">
              Plan today
            </Link>
          </p>
        ) : (
          <p className="mt-4 max-w-prose text-title leading-snug">
            This week you completed {thisWeek.done} of {thisWeek.total}{" "}
            <span className="whitespace-nowrap">to-dos</span>
            {thisWeek.total ? ` (${thisWeek.pct}%)` : ""}.{" "}
            {carriedOver.count > 0 ? (
              <>
                <span className="text-signal">
                  {carriedOver.count} {carriedOver.count === 1 ? "is" : "are"} carried over
                </span>
                , delayed {carriedOver.avgDays} days on average.
              </>
            ) : (
              "Nothing is carried over."
            )}{" "}
            Overall, {overall.done} of {overall.total} done ({overall.pct}%).
          </p>
        )}
      </header>

      <Section title="Cumulative">
        <CumulativeChart days={days} />
      </Section>

      <Section title="Daily completion, last 30 days">
        <DailyChart days={days} />
      </Section>

      <Section title="By category">
        <ul>
          {byCategory.map((c) => (
            <li key={c.id} className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 border-b border-rule py-3 md:grid-cols-[auto_200px_1fr]">
              <CodePlate code={c.code} color={c.color} />
              <span className="font-semibold">{c.name}</span>
              <div className="col-span-2 md:col-span-1">
                <ProgressBar progress={c.progress} label={`${c.name} progress`} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="By objective">
        {active.length === 0 ? (
          <p className="py-4 text-muted">
            No objectives yet.{" "}
            <Link href="/objectives/new" className="font-semibold text-ink underline">
              Create one
            </Link>
          </p>
        ) : (
          <ul>
            {active.map((o) => (
              <li key={o.id} className="border-b border-rule">
                <details className="group">
                  <summary className="grid cursor-pointer list-none gap-2 py-3 md:grid-cols-[1fr_320px] md:gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-2">
                      <CodePlate code={o.category.code} color={o.category.color} name={o.category.name} />
                      <span className="truncate font-semibold group-open:underline">{o.title}</span>
                    </span>
                    <ProgressBar progress={o.progress} label={`${o.title} progress`} />
                  </summary>
                  <ul className="mb-3 pl-6">
                    {o.subObjectives.map((s) => (
                      <li key={s.id} className="grid gap-1 py-2 md:grid-cols-[1fr_320px] md:gap-6">
                        <span className="text-meta font-semibold">{s.title}</span>
                        <ProgressBar progress={s.progress} label={`${s.title} progress`} />
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
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
