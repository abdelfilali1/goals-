"use client";

import { useTransition } from "react";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { deleteObjective, setArchived } from "@/app/objectives/actions";

export function ObjectiveActions({ id, archived, title }: { id: string; archived: boolean; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="mt-12 flex flex-wrap gap-2 border-t border-rule pt-6">
      <button
        type="button"
        className="btn btn-quiet"
        disabled={pending}
        onClick={() => startTransition(() => setArchived(id, !archived))}
      >
        {archived ? <ArchiveRestore size={18} aria-hidden /> : <Archive size={18} aria-hidden />}
        {archived ? "Restore from archive" : "Archive"}
      </button>
      <button
        type="button"
        className="btn btn-quiet"
        disabled={pending}
        onClick={() => {
          if (window.confirm(`Delete “${title}” and all its to-dos? This cannot be undone. Archive it instead to keep its history.`)) {
            startTransition(() => deleteObjective(id));
          }
        }}
      >
        <Trash2 size={18} aria-hidden /> Delete
      </button>
    </div>
  );
}
