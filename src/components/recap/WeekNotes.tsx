"use client";

import { useActionState, useState } from "react";
import { saveWeekNote } from "@/app/recap/actions";

/** The week's free-text notes, saved on request. */
export function WeekNotes({ week, initial }: { week: string; initial: string }) {
  const [state, action, pending] = useActionState(saveWeekNote, undefined);
  const [notes, setNotes] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [lastSave, setLastSave] = useState<number | undefined>(undefined);
  // Once a save lands, what was sent becomes the saved text.
  if (state?.savedAt && state.savedAt !== lastSave) {
    setLastSave(state.savedAt);
    setSaved(notes);
  }
  const dirty = notes !== saved;

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="week" value={week} />
      <label htmlFor="week-notes" className="sr-only">
        Notes for this week
      </label>
      <textarea
        id="week-notes"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={10}
        placeholder="What went well, what got in the way, what to change next week…"
        className="field resize-y"
      />
      <div className="flex items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending || !dirty}>
          {pending ? "Saving…" : "Save notes"}
        </button>
        <p className="text-meta font-semibold text-muted" aria-live="polite">
          {state?.error ? (
            <span className="text-signal">{state.error}</span>
          ) : dirty ? (
            "Unsaved changes"
          ) : saved ? (
            "Saved"
          ) : null}
        </p>
      </div>
    </form>
  );
}
