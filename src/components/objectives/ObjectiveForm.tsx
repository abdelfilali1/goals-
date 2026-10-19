"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { createCategory, createObjective, updateObjective, type ObjectiveInput } from "@/app/objectives/actions";

type Category = { id: string; name: string; code: string };
type Sub = { key: string; id?: string; title: string };

let keySeq = 0;
const newKey = () => `new-${++keySeq}`;

export function ObjectiveForm({
  categories: initialCategories,
  objectiveId,
  initial,
}: {
  categories: Category[];
  objectiveId?: string;
  initial?: Omit<ObjectiveInput, "subObjectives"> & { subObjectives: { id: string; title: string }[] };
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? "");
  const [subs, setSubs] = useState<Sub[]>(
    initial?.subObjectives.length
      ? initial.subObjectives.map((s) => ({ key: s.id, id: s.id, title: s.title }))
      : [{ key: newKey(), title: "" }],
  );
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const subRefs = useRef(new Map<string, HTMLInputElement>());

  const addSub = (after?: number) => {
    const sub = { key: newKey(), title: "" };
    setSubs((list) => {
      const next = [...list];
      next.splice(after === undefined ? list.length : after + 1, 0, sub);
      return next;
    });
    requestAnimationFrame(() => subRefs.current.get(sub.key)?.focus());
  };
  const moveSub = (i: number, by: number) =>
    setSubs((list) => {
      const next = [...list];
      const [item] = next.splice(i, 1);
      next.splice(i + by, 0, item);
      return next;
    });

  const addCategory = () =>
    startTransition(async () => {
      if (!newCategory) return;
      const res = await createCategory(newCategory);
      if (res.error || !res.id) {
        setError(res.error);
        return;
      }
      setCategories((list) => [...list, { id: res.id!, name: newCategory.trim(), code: "" }]);
      setCategoryId(res.id);
      setNewCategory(null);
      setError(undefined);
      router.refresh();
    });

  const submit = () =>
    startTransition(async () => {
      const input: ObjectiveInput = {
        title,
        description,
        categoryId,
        targetDate: targetDate || null,
        subObjectives: subs.map((s) => ({ id: s.id, title: s.title })),
      };
      const res = objectiveId ? await updateObjective(objectiveId, input) : await createObjective(input);
      if (res?.error) {
        setError(res.error);
        return;
      }
      if (objectiveId) router.push(`/objectives/${objectiveId}`);
    });

  return (
    <form
      className="mt-8 flex max-w-2xl flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Title</span>
        <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus={!objectiveId} placeholder="Run a half marathon" />
      </label>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="font-semibold">
          Category
        </label>
        {newCategory === null ? (
          <div className="flex gap-2">
            <select id="category" className="field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-quiet" onClick={() => setNewCategory("")}>
              <Plus size={18} aria-hidden /> New
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              id="category"
              className="field"
              placeholder="Category name, e.g. Learning"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCategory();
                }
                if (e.key === "Escape") setNewCategory(null);
              }}
              autoFocus
            />
            <button type="button" className="btn btn-secondary" onClick={addCategory} disabled={pending || !newCategory.trim()}>
              Add
            </button>
            <button type="button" className="icon-btn flex-none" aria-label="Cancel new category" onClick={() => setNewCategory(null)}>
              <X size={18} aria-hidden />
            </button>
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1">
        <span className="font-semibold">Description</span>
        <textarea
          className="field min-h-28 resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why it matters and what done looks like."
        />
      </label>

      <label className="flex flex-col gap-1 sm:max-w-60">
        <span className="font-semibold">
          Target date <span className="font-normal text-muted">(optional)</span>
        </span>
        <input type="date" className="field" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold">Sub-objectives</legend>
        <p className="mb-1 text-meta text-muted">The steps or areas this objective breaks into. Every to-do links to one.</p>
        <ol className="flex flex-col gap-2">
          {subs.map((s, i) => (
            <li key={s.key} className="flex items-center gap-1">
              <span className="board w-6 flex-none text-meta font-bold text-muted" aria-hidden>
                {i + 1}
              </span>
              <input
                ref={(el) => {
                  if (el) subRefs.current.set(s.key, el);
                  else subRefs.current.delete(s.key);
                }}
                className="field"
                aria-label={`Sub-objective ${i + 1}`}
                value={s.title}
                placeholder={i === 0 ? "Endurance" : "Another sub-objective"}
                onChange={(e) => setSubs((list) => list.map((x) => (x.key === s.key ? { ...x, title: e.target.value } : x)))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSub(i);
                  }
                }}
              />
              <button type="button" className="icon-btn flex-none" aria-label={`Move sub-objective ${i + 1} up`} disabled={i === 0} onClick={() => moveSub(i, -1)}>
                <ArrowUp size={18} aria-hidden className={i === 0 ? "opacity-30" : ""} />
              </button>
              <button
                type="button"
                className="icon-btn flex-none"
                aria-label={`Move sub-objective ${i + 1} down`}
                disabled={i === subs.length - 1}
                onClick={() => moveSub(i, 1)}
              >
                <ArrowDown size={18} aria-hidden className={i === subs.length - 1 ? "opacity-30" : ""} />
              </button>
              <button
                type="button"
                className="icon-btn flex-none"
                aria-label={`Remove sub-objective ${i + 1}`}
                disabled={subs.length === 1}
                onClick={() => setSubs((list) => list.filter((x) => x.key !== s.key))}
              >
                <X size={18} aria-hidden className={subs.length === 1 ? "opacity-30" : ""} />
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-quiet self-start" onClick={() => addSub()}>
          <Plus size={18} aria-hidden /> Add sub-objective
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="font-semibold text-signal">
          {error}
        </p>
      )}

      <div className="flex gap-2 border-t border-rule pt-6">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : objectiveId ? "Save changes" : "Create objective"}
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
