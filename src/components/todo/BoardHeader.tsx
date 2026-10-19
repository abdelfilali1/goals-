import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type View = "day" | "week" | "month";

const VIEWS: { id: View; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

const href = (view: View, date: string) => `/todo?view=${view}&date=${date}`;

/** The board's head: the date set large, the done readout, and the view and date controls. */
export function BoardHeader({
  view,
  date,
  title,
  note,
  done,
  total,
  prev,
  next,
  today,
  showToday,
}: {
  view: View;
  date: string;
  title: string;
  note?: string;
  done: number;
  total: number;
  prev: string;
  next: string;
  today: string;
  showToday: boolean;
}) {
  const unit = view === "day" ? "Previous day" : view === "week" ? "Previous week" : "Previous month";
  const unitNext = unit.replace("Previous", "Next");
  return (
    <header className="pt-2 md:pt-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="board text-board font-extrabold tracking-tight">
          {title}
          {note && <span className="ml-2 align-middle text-body font-semibold tracking-normal text-muted">{note}</span>}
        </h1>
        <p className="board pb-1 text-right text-body font-bold text-muted" aria-live="polite">
          <span className="text-ink">{done}</span> of {total} done
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-b-2 border-ink">
        <nav aria-label="View" className="flex gap-5">
          {VIEWS.map((v) => (
            <Link
              key={v.id}
              href={href(v.id, date)}
              aria-current={v.id === view ? "page" : undefined}
              className={`-mb-0.5 flex h-11 items-center border-b-2 font-semibold ${
                v.id === view ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          {showToday && (
            <Link href={href(view, today)} className="btn btn-quiet h-11 px-3 text-meta">
              Today
            </Link>
          )}
          <Link href={href(view, prev)} className="icon-btn" aria-label={unit} title={unit}>
            <ChevronLeft size={20} aria-hidden />
          </Link>
          <Link href={href(view, next)} className="icon-btn -mr-3" aria-label={unitNext} title={unitNext}>
            <ChevronRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
