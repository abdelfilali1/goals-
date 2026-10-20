"use client";

import { MAX_REPEAT_DAYS, WEEKDAY_LABELS, addDays, diffDays, isoWeekday, repeatDays, type Day } from "@/lib/dates";

export type RepeatValue = { start: Day; end: Day; weekdays: number[] };

/** Four weeks on the same weekday as the start: a sensible first guess. */
export function defaultRepeat(day: Day): RepeatValue {
  return { start: day, end: addDays(day, 27), weekdays: [isoWeekday(day)] };
}

const PRESETS: { label: string; days: number[] }[] = [
  { label: "Every day", days: [1, 2, 3, 4, 5, 6, 7] },
  { label: "Weekdays", days: [1, 2, 3, 4, 5] },
  { label: "Weekends", days: [6, 7] },
];

const short = (d: Day) => `${d.slice(8)}.${d.slice(5, 7)}`;

export function RepeatFields({
  id,
  value,
  onChange,
  editing = false,
}: {
  id: string;
  value: RepeatValue;
  onChange: (value: RepeatValue) => void;
  /** Editing an existing series: the summary counts days in the repeat. */
  editing?: boolean;
}) {
  const days = repeatDays(value.start, value.end, value.weekdays);
  const tooLong = value.end >= value.start && diffDays(value.end, value.start) > MAX_REPEAT_DAYS;
  const backwards = value.end < value.start;
  const toggle = (n: number) =>
    onChange({
      ...value,
      weekdays: value.weekdays.includes(n) ? value.weekdays.filter((d) => d !== n) : [...value.weekdays, n],
    });
  const same = (a: number[], b: number[]) => a.length === b.length && b.every((d) => a.includes(d));

  let summary: string;
  if (backwards) summary = "The end date is before the start date.";
  else if (tooLong) summary = "A repeat can cover one year at most.";
  else if (value.weekdays.length === 0) summary = "Pick at least one day.";
  else if (days.length === 0) summary = "None of the chosen days fall between those dates.";
  else
    summary = `${days.length} ${editing ? "day" : "to-do"}${days.length === 1 ? "" : "s"}${editing ? " in this repeat" : ""}, ${short(days[0])} to ${short(days[days.length - 1])}.`;
  const problem = backwards || tooLong || days.length === 0;

  return (
    <fieldset id={id} className="flex flex-col gap-4 border-y border-rule py-4">
      <legend className="sr-only">Repeat</legend>
      {!editing && <input type="hidden" name="repeat" value="on" />}

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <label className="flex flex-col gap-1">
          <span className="text-meta font-semibold text-muted">Starts</span>
          <input
            type="date"
            name="startDate"
            className="field"
            required
            value={value.start}
            onChange={(e) => e.target.value && onChange({ ...value, start: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-meta font-semibold text-muted">Ends</span>
          <input
            type="date"
            name="endDate"
            className="field"
            required
            min={value.start}
            value={value.end}
            onChange={(e) => e.target.value && onChange({ ...value, end: e.target.value })}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-meta font-semibold text-muted">On</legend>
        <div className="mt-1 grid grid-cols-7 gap-1 sm:max-w-md">
          {WEEKDAY_LABELS.map((label, i) => {
            const n = i + 1;
            const on = value.weekdays.includes(n);
            return (
              <label key={label} className="relative">
                <input
                  type="checkbox"
                  name="weekday"
                  value={n}
                  checked={on}
                  onChange={() => toggle(n)}
                  className="peer sr-only"
                />
                <span
                  className={`board flex h-11 cursor-pointer items-center justify-center rounded border text-body font-extrabold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                    on ? "border-ink bg-ink text-paper" : "border-rule text-ink hover:border-ink"
                  }`}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange({ ...value, weekdays: p.days })}
              aria-pressed={same(value.weekdays, p.days)}
              className="min-h-11 text-meta font-semibold text-muted underline-offset-4 hover:text-ink hover:underline aria-pressed:text-ink aria-pressed:underline"
            >
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      <p aria-live="polite" className={`board text-body font-bold ${problem ? "text-signal" : "text-ink"}`}>
        {summary}
      </p>
    </fieldset>
  );
}
