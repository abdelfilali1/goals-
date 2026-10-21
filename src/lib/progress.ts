import "server-only";
import { db } from "./db";
import { addDays, daysBetween, diffDays, fromDb, startOfWeek, toDb, type Day } from "./dates";

// Progress = done ÷ total for to-dos due on or before today.
// Future to-dos are left out so planning ahead never lowers the numbers.

export type Ratio = { done: number; total: number; pct: number };

export function ratio(done: number, total: number): Ratio {
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

type Counts = { done: number; total: number };
const empty = (): Counts => ({ done: 0, total: 0 });

function add(map: Map<string, Counts>, key: string, done: boolean, n: number) {
  const c = map.get(key) ?? empty();
  c.total += n;
  if (done) c.done += n;
  map.set(key, c);
}

/** Done/total per sub-objective, for to-dos due by `today`. */
async function countsBySub(today: Day, objectiveId?: string) {
  const groups = await db.todo.groupBy({
    by: ["subObjectiveId", "done"],
    where: { dueDate: { lte: toDb(today) }, ...(objectiveId ? { objectiveId } : {}) },
    _count: { _all: true },
  });
  const bySub = new Map<string, Counts>();
  for (const g of groups) add(bySub, g.subObjectiveId, g.done, g._count._all);
  return bySub;
}

export type ObjectiveProgress = {
  id: string;
  title: string;
  description: string;
  archived: boolean;
  category: { id: string; name: string; code: string; color: string };
  progress: Ratio;
  subObjectives: { id: string; title: string; progress: Ratio }[];
};

/** Every objective with its own and its sub-objectives' progress. */
export async function getObjectiveProgress(today: Day, opts: { objectiveId?: string } = {}) {
  const [bySub, objectives] = await Promise.all([
    countsBySub(today, opts.objectiveId),
    db.objective.findMany({
      where: opts.objectiveId ? { id: opts.objectiveId } : {},
      include: { category: true, subObjectives: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ category: { sortOrder: "asc" } }, { createdAt: "asc" }],
    }),
  ]);

  return objectives.map<ObjectiveProgress>((o) => {
    const total = empty();
    const subObjectives = o.subObjectives.map((s) => {
      const c = bySub.get(s.id) ?? empty();
      total.done += c.done;
      total.total += c.total;
      return { id: s.id, title: s.title, progress: ratio(c.done, c.total) };
    });
    return {
      id: o.id,
      title: o.title,
      description: o.description,
      archived: o.archived,
      category: { id: o.category.id, name: o.category.name, code: o.category.code, color: o.category.color },
      progress: ratio(total.done, total.total),
      subObjectives,
    };
  });
}

export type DayPoint = {
  day: Day;
  done: number;
  total: number;
  cumulativeDone: number;
  cumulativePlanned: number;
};

export async function getProgressOverview(today: Day) {
  const [objectives, categories, byDay, carried] = await Promise.all([
    getObjectiveProgress(today),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.todo.groupBy({
      by: ["dueDate", "done"],
      where: { dueDate: { lte: toDb(today) } },
      _count: { _all: true },
    }),
    db.todo.findMany({
      where: { done: false, missed: false, pushCount: { gt: 0 } },
      select: { dueDate: true, originalDate: true },
    }),
  ]);

  // Per category, summed from objectives.
  const catCounts = new Map<string, Counts>();
  for (const o of objectives) {
    const c = catCounts.get(o.category.id) ?? empty();
    c.done += o.progress.done;
    c.total += o.progress.total;
    catCounts.set(o.category.id, c);
  }
  const byCategory = categories.map((c) => {
    const counts = catCounts.get(c.id) ?? empty();
    return { id: c.id, name: c.name, code: c.code, color: c.color, progress: ratio(counts.done, counts.total) };
  });

  // Per day, then running totals.
  const dayCounts = new Map<string, Counts>();
  for (const g of byDay) add(dayCounts, fromDb(g.dueDate), g.done, g._count._all);
  const firstDay = [...dayCounts.keys()].sort()[0] ?? addDays(today, -29);
  const start = firstDay < addDays(today, -29) ? firstDay : addDays(today, -29);
  let cumDone = 0;
  let cumPlanned = 0;
  const days: DayPoint[] = daysBetween(start, today).map((day) => {
    const c = dayCounts.get(day) ?? empty();
    cumDone += c.done;
    cumPlanned += c.total;
    return { day, done: c.done, total: c.total, cumulativeDone: cumDone, cumulativePlanned: cumPlanned };
  });

  const overall = ratio(cumDone, cumPlanned);

  const weekStart = startOfWeek(today);
  const week = days.filter((d) => d.day >= weekStart);
  const thisWeek = ratio(
    week.reduce((s, d) => s + d.done, 0),
    week.reduce((s, d) => s + d.total, 0),
  );

  const carriedDays = carried.map((t) => diffDays(fromDb(t.dueDate), fromDb(t.originalDate)));
  const carriedOver = {
    count: carried.length,
    avgDays: carried.length ? Math.round((carriedDays.reduce((a, b) => a + b, 0) / carried.length) * 10) / 10 : 0,
  };

  return { overall, thisWeek, carriedOver, byCategory, objectives, days };
}
