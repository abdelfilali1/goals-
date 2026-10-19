"use client";

import { useEffect, useRef, useState } from "react";

/** "+N d" in the board's red. The numeral rolls in only when it changes, never on first paint. */
export function Delay({ days, muted }: { days: number; muted?: boolean }) {
  const first = useRef(days);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (days !== first.current) setChanged(true);
  }, [days]);

  if (days <= 0) return null;
  return (
    <span
      className={`board text-title font-extrabold ${muted ? "text-muted" : "text-signal"}`}
      aria-label={`Pushed by ${days} day${days === 1 ? "" : "s"}`}
      title={`Pushed by ${days} day${days === 1 ? "" : "s"}`}
    >
      <span key={days} className={changed ? "delay-roll" : undefined}>
        +{days}
      </span>
      <span className="ml-0.5 text-meta font-bold">d</span>
    </span>
  );
}
