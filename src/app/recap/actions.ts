"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isDay, startOfWeek, toDb } from "@/lib/dates";

export type NoteResult = { error?: string; savedAt?: number };

export async function saveWeekNote(_prev: NoteResult | undefined, formData: FormData): Promise<NoteResult> {
  const week = String(formData.get("week") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!isDay(week)) return { error: "That week is not valid." };
  const weekStart = toDb(startOfWeek(week));
  await db.weekNote.upsert({
    where: { weekStart },
    create: { weekStart, notes },
    update: { notes },
  });
  revalidatePath("/recap");
  return { savedAt: Date.now() };
}
