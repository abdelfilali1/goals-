"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Bar,
  LabelList,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayPoint } from "@/lib/progress";

// Validated pair (dataviz validator, light surface): done in the board's green, planned in slate blue.
const DONE = "#1E7A46";
const PLANNED = "#2F5FB8";
const GRID = "#E6E8EB";
const AXIS = "#5F646B";

type TipProps = { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> };

const short = (d: string) => `${d.slice(8)}.${d.slice(5, 7)}`;
const tick = { fill: AXIS, fontSize: 13, fontStretch: "75%" as const, fontWeight: 700 };

const RANGES = [
  { id: "30", label: "30 days", days: 30 },
  { id: "90", label: "90 days", days: 90 },
  { id: "all", label: "All", days: Infinity },
] as const;

function TooltipShell({ day, children }: { day: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-rule bg-paper px-3 py-2 text-meta shadow-[0_4px_12px_rgba(17,17,17,0.08)]">
      <p className="board font-bold text-muted">{short(day)}</p>
      {children}
    </div>
  );
}

function KeyRow({ color, value, label, dashed }: { color: string; value: string; label: string; dashed?: boolean }) {
  return (
    <p className="mt-1 flex items-center gap-2">
      <svg width="14" height="4" aria-hidden>
        <line x1="0" y1="2" x2="14" y2="2" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "4 3" : undefined} />
      </svg>
      <span className="board text-body font-extrabold text-ink">{value}</span>
      <span className="text-muted">{label}</span>
    </p>
  );
}

export function CumulativeChart({ days }: { days: DayPoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30");
  const data = useMemo(() => {
    const n = RANGES.find((r) => r.id === range)!.days;
    return Number.isFinite(n) ? days.slice(-n) : days;
  }, [days, range]);
  const last = data[data.length - 1];

  const CumTooltip = ({ active, payload }: TipProps) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload as DayPoint;
    return (
      <TooltipShell day={p.day}>
        <KeyRow color={DONE} value={String(p.cumulativeDone)} label="completed" />
        <KeyRow color={PLANNED} value={String(p.cumulativePlanned)} label="planned" dashed />
      </TooltipShell>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex gap-4 text-meta" aria-label="Legend">
          <li className="flex items-center gap-2">
            <svg width="16" height="4" aria-hidden>
              <line x1="0" y1="2" x2="16" y2="2" stroke={DONE} strokeWidth="2" />
            </svg>
            Completed <span className="board text-body font-extrabold">{last?.cumulativeDone ?? 0}</span>
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="4" aria-hidden>
              <line x1="0" y1="2" x2="16" y2="2" stroke={PLANNED} strokeWidth="2" strokeDasharray="4 3" />
            </svg>
            Planned <span className="board text-body font-extrabold">{last?.cumulativePlanned ?? 0}</span>
          </li>
        </ul>
        <div role="radiogroup" aria-label="Time range" className="flex rounded border border-rule p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={range === r.id}
              onClick={() => setRange(r.id)}
              className={`h-11 rounded-plate px-3 text-meta font-semibold ${range === r.id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-64 md:h-72" role="img" aria-label={`Cumulative to-dos: ${last?.cumulativeDone ?? 0} completed of ${last?.cumulativePlanned ?? 0} planned`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis dataKey="day" tickFormatter={short} tick={tick} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={24} />
            <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} width={44} />
            <Tooltip content={CumTooltip} cursor={{ stroke: AXIS, strokeWidth: 1 }} isAnimationActive={false} />
            <Line
              type="monotone"
              dataKey="cumulativePlanned"
              name="Planned"
              stroke={PLANNED}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="cumulativeDone"
              name="Completed"
              stroke={DONE}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <DataTable days={data} />
    </div>
  );
}

type Rate = DayPoint & { pct: number | null };

export function DailyChart({ days }: { days: DayPoint[] }) {
  const data: Rate[] = days.slice(-30).map((d) => ({ ...d, pct: d.total ? Math.round((d.done / d.total) * 100) : null }));
  const wide = useWide();
  const short_ = data.filter((d) => d.total > 0 && d.done < d.total);

  const RateTooltip = ({ active, payload }: TipProps) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload as Rate;
    return (
      <TooltipShell day={p.day}>
        {p.total ? (
          <p className="mt-1">
            <span className="board text-body font-extrabold">{p.pct}%</span>{" "}
            <span className="text-muted">
              {p.done} of {p.total} done
            </span>
          </p>
        ) : (
          <p className="mt-1 text-muted">Nothing planned</p>
        )}
      </TooltipShell>
    );
  };

  return (
    <div>
    <div className="h-32 md:h-36" role="img" aria-label="Share of each day's to-dos completed, last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 22, right: 14, bottom: 0, left: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="day" tickFormatter={short} tick={tick} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={24} />
          <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(v) => `${v}%`} tick={tick} tickLine={false} axisLine={false} width={52} />
          <Tooltip content={RateTooltip} cursor={{ fill: "#F3F4F6" }} isAnimationActive={false} />
          <Bar dataKey="pct" fill={DONE} radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false}>
            {wide && <LabelList dataKey="pct" content={(p: { x?: unknown; y?: unknown; width?: unknown; index?: unknown }) => {
              const d = data[Number(p.index)];
              if (!d || !d.total || d.done === d.total) return null;
              return (
                <text x={Number(p.x) + Number(p.width) / 2} y={Number(p.y) - 6} textAnchor="middle" fill="#111" fontSize={13} fontWeight={800} style={{ fontStretch: "75%" }}>
                  {d.done}/{d.total}
                </text>
              );
            }} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
      {!wide && short_.length > 0 && (
        <p className="mt-2 text-meta text-muted">
          Below 100%:{" "}
          {short_.map((d, i) => (
            <span key={d.day} className="board font-bold text-ink">
              {i > 0 && <span className="text-muted"> · </span>}
              {short(d.day)} {d.done}/{d.total}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function DataTable({ days }: { days: DayPoint[] }) {
  return (
    <details className="mt-3">
      <summary className="inline-flex min-h-11 cursor-pointer items-center text-meta font-semibold text-muted hover:text-ink">
        Show as table
      </summary>
      <div className="max-h-72 overflow-y-auto border-t border-rule">
        <table className="w-full text-left text-meta">
          <thead className="board sticky top-0 bg-paper text-muted">
            <tr>
              <th className="py-2 font-bold">Day</th>
              <th className="py-2 text-right font-bold">Done</th>
              <th className="py-2 text-right font-bold">Planned</th>
              <th className="py-2 text-right font-bold">Cumulative done</th>
              <th className="py-2 text-right font-bold">Cumulative planned</th>
            </tr>
          </thead>
          <tbody className="tnum">
            {[...days].reverse().map((d) => (
              <tr key={d.day} className="border-t border-rule">
                <td className="py-1.5">{short(d.day)}</td>
                <td className="py-1.5 text-right">{d.done}</td>
                <td className="py-1.5 text-right">{d.total}</td>
                <td className="py-1.5 text-right">{d.cumulativeDone}</td>
                <td className="py-1.5 text-right">{d.cumulativePlanned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** True from the md breakpoint up; in-plot labels only have room there. */
function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );
}
