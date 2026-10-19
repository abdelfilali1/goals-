"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/app/objectives/actions";
import { CodePlate } from "@/components/CodePlate";

type Category = { id: string; name: string; code: string; color: string; objectives: number };

export function CategoryManager({ categories, colors }: { categories: Category[]; colors: string[] }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const add = () =>
    startTransition(async () => {
      const res = await createCategory(name);
      if (res.error) setError(res.error);
      else {
        setName("");
        setError(undefined);
      }
    });

  return (
    <div className="mt-8 max-w-2xl">
      <ul className="border-t-2 border-ink">
        {categories.map((c) => (
          <CategoryRow key={`${c.id}-${c.name}-${c.code}-${c.color}`} category={c} colors={colors} />
        ))}
      </ul>

      <form
        className="mt-8 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <label htmlFor="new-category" className="font-semibold">
          New category
        </label>
        <div className="flex gap-2">
          <input
            id="new-category"
            className="field"
            placeholder="Learning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={pending || !name.trim()}>
            <Plus size={18} aria-hidden /> Add
          </button>
        </div>
        {error && (
          <p role="alert" className="text-meta font-semibold text-signal">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

function CategoryRow({ category, colors }: { category: Category; colors: string[] }) {
  const [name, setName] = useState(category.name);
  const [code, setCode] = useState(category.code);
  const [color, setColor] = useState(category.color);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = name !== category.name || code !== category.code || color !== category.color;
  const count = `${category.objectives} objective${category.objectives === 1 ? "" : "s"}`;

  const save = () =>
    startTransition(async () => {
      const res = await updateCategory(category.id, { name, code, color });
      setError(res.error);
      setSaved(!res.error);
    });

  const remove = () =>
    startTransition(async () => {
      if (!window.confirm(`Delete the ${category.name} category?`)) return;
      const res = await deleteCategory(category.id);
      if (res.error) setError(res.error);
    });

  if (!editing) {
    return (
      <li className="flex items-center gap-3 border-b border-rule py-2">
        <CodePlate code={category.code} color={category.color} size="md" />
        <span className="font-bold">{category.name}</span>
        <span className="ml-auto text-meta text-muted">{count}</span>
        <button
          type="button"
          className="icon-btn -mr-2"
          aria-label={`Edit ${category.name}`}
          title="Edit"
          onClick={() => setEditing(true)}
        >
          <Pencil size={18} aria-hidden />
        </button>
      </li>
    );
  }

  return (
    <li className="border-b border-rule py-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <CodePlate code={code.toUpperCase() || "–"} color={color} size="md" />
          <span className="font-bold">{name || "Untitled"}</span>
          <span className="ml-auto text-meta text-muted">{count}</span>
        </div>
        <div className="grid grid-cols-[96px_1fr] gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-meta font-semibold text-muted">Code</span>
            <input
              className="field board font-extrabold uppercase"
              value={code}
              maxLength={4}
              onChange={(e) => {
                setCode(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-meta font-semibold text-muted">Name</span>
            <input
              className="field"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              required
            />
          </label>
        </div>
        <fieldset>
          <legend className="text-meta font-semibold text-muted">Colour</legend>
          <div className="mt-1 flex flex-wrap gap-1">
            {colors.map((c) => (
              <label key={c} className="grid h-11 w-11 cursor-pointer place-items-center rounded">
                <input
                  type="radio"
                  name={`color-${category.id}`}
                  value={c}
                  checked={color === c}
                  onChange={() => {
                    setColor(c);
                    setSaved(false);
                  }}
                  className="peer sr-only"
                />
                <span
                  className="h-7 w-7 rounded-plate ring-offset-2 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink"
                  style={{ backgroundColor: c }}
                />
                <span className="sr-only">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-meta font-semibold text-signal">
            {error}
          </p>
        )}
        <div className="flex items-center gap-2">
          <button type="submit" className="btn btn-secondary" disabled={pending || !dirty}>
            Save
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => setEditing(false)}>
            {saved && !dirty ? "Done" : "Cancel"}
          </button>
          {saved && !dirty && <span className="text-meta font-semibold text-go">Saved</span>}
          <button
            type="button"
            className="btn btn-quiet ml-auto"
            onClick={remove}
            disabled={pending}
            title={category.objectives > 0 ? "Move its objectives to another category first" : undefined}
          >
            <Trash2 size={18} aria-hidden /> Delete
          </button>
        </div>
      </form>
    </li>
  );
}
