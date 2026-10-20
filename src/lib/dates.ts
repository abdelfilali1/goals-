// Days are passed around as "YYYY-MM-DD" strings. Postgres DATE columns come
// back from Prisma as Date objects at UTC midnight, so all conversion is UTC.

export type Day = string;

export const TZ_COOKIE = "tz";

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDay(value: unknown): value is Day {
  return typeof value === "string" && DAY_RE.test(value) && !Number.isNaN(toDb(value).getTime());
}

export function toDb(day: Day): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export function fromDb(date: Date): Day {
  return date.toISOString().slice(0, 10);
}

export function addDays(day: Day, n: number): Day {
  const d = toDb(day);
  d.setUTCDate(d.getUTCDate() + n);
  return fromDb(d);
}

export function diffDays(later: Day, earlier: Day): number {
  return Math.round((toDb(later).getTime() - toDb(earlier).getTime()) / 86_400_000);
}

/** Today in the given IANA timezone. */
export function todayIn(timeZone: string): Day {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date());
  }
}

/** Monday of the week containing `day`. */
export function startOfWeek(day: Day): Day {
  const weekday = toDb(day).getUTCDay(); // 0 = Sunday
  return addDays(day, -((weekday + 6) % 7));
}

export function startOfMonth(day: Day): Day {
  return `${day.slice(0, 7)}-01`;
}

export function endOfMonth(day: Day): Day {
  const d = toDb(startOfMonth(day));
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return fromDb(d);
}

export function addMonths(day: Day, n: number): Day {
  const d = toDb(startOfMonth(day));
  d.setUTCMonth(d.getUTCMonth() + n);
  return fromDb(d);
}

export function daysBetween(from: Day, to: Day): Day[] {
  const out: Day[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" });

export function formatDay(day: Day, style: "long" | "short" | "weekday" | "month" | "num" = "long") {
  const d = toDb(day);
  switch (style) {
    case "long":
      return fmt({ weekday: "long", day: "numeric", month: "long" }).format(d);
    case "short":
      return fmt({ weekday: "short", day: "numeric", month: "short" }).format(d);
    case "weekday":
      return fmt({ weekday: "short" }).format(d);
    case "month":
      return fmt({ month: "long", year: "numeric" }).format(d);
    case "num":
      return String(d.getUTCDate());
  }
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export function isoWeekday(day: Day): number {
  return ((toDb(day).getUTCDay() + 6) % 7) + 1;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** The longest span a recurring to-do may cover. */
export const MAX_REPEAT_DAYS = 366;

/** Every day from start to end (inclusive) that falls on one of the ISO weekdays. */
export function repeatDays(start: Day, end: Day, weekdays: number[]): Day[] {
  if (end < start || diffDays(end, start) > MAX_REPEAT_DAYS) return [];
  const set = new Set(weekdays);
  return daysBetween(start, end).filter((d) => set.has(isoWeekday(d)));
}
