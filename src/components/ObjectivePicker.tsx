"use client";

import { useId } from "react";
import type { ObjectiveOption } from "@/lib/queries";

export type Pick = { objectiveId: string; subObjectiveId: string };

/** Objective select grouped by category, with the sub-objective select filtered to match. */
export function ObjectivePicker({
  options,
  value,
  onChange,
  disabled,
}: {
  options: ObjectiveOption[];
  value: Pick;
  onChange: (value: Pick) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const groups = new Map<string, { label: string; items: ObjectiveOption[] }>();
  for (const o of options) {
    const g = groups.get(o.category.id) ?? { label: `${o.category.code} · ${o.category.name}`, items: [] };
    g.items.push(o);
    groups.set(o.category.id, g);
  }
  const subs = options.find((o) => o.id === value.objectiveId)?.subObjectives ?? [];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-obj`} className="text-meta font-semibold text-muted">
          Objective
        </label>
        <select
          id={`${id}-obj`}
          name="objectiveId"
          className="field"
          required
          disabled={disabled}
          value={value.objectiveId}
          onChange={(e) => {
            const next = options.find((o) => o.id === e.target.value);
            onChange({
              objectiveId: e.target.value,
              subObjectiveId: next?.subObjectives.length === 1 ? next.subObjectives[0].id : "",
            });
          }}
        >
          <option value="" disabled>
            Choose an objective
          </option>
          {[...groups.values()].map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-sub`} className="text-meta font-semibold text-muted">
          Sub-objective
        </label>
        <select
          id={`${id}-sub`}
          name="subObjectiveId"
          className="field"
          required
          disabled={disabled || !value.objectiveId}
          value={value.subObjectiveId}
          onChange={(e) => onChange({ ...value, subObjectiveId: e.target.value })}
        >
          <option value="" disabled>
            {value.objectiveId ? "Choose a sub-objective" : "Pick an objective first"}
          </option>
          {subs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
