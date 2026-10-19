import type { Ratio } from "@/lib/progress";

/** A thin completion bar with its figures set in the board voice. */
export function ProgressBar({ progress, label, showCounts = true }: { progress: Ratio; label: string; showCounts?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.pct}
        aria-valuetext={progress.total ? `${progress.pct}%, ${progress.done} of ${progress.total} done` : "No to-dos due yet"}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-wash"
      >
        <div className="h-full rounded-full bg-go" style={{ width: `${progress.pct}%` }} />
      </div>
      <span className="board w-11 text-right text-body font-extrabold">{progress.total ? `${progress.pct}%` : "–"}</span>
      {showCounts && (
        <span className="board w-12 text-right text-meta font-bold text-muted">
          {progress.done}/{progress.total}
        </span>
      )}
    </div>
  );
}
