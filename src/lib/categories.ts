import type { PrismaClient } from "@prisma/client";

// Plate colours carry white condensed text, so every one keeps at least 4.5:1 against white.
export const DEFAULT_CATEGORIES = [
  { name: "Family", code: "FAM", color: "#9A4B40" },
  { name: "Health", code: "HLT", color: "#2F6E4E" },
  { name: "Work", code: "WRK", color: "#34558A" },
  { name: "Personal", code: "PER", color: "#7D6222" },
  { name: "Finance", code: "FIN", color: "#3F646B" },
];

/** Colours offered when picking a category colour. */
export const CATEGORY_COLORS = [
  "#9A4B40",
  "#2F6E4E",
  "#34558A",
  "#7D6222",
  "#3F646B",
  "#6B5345",
  "#59612A",
  "#7A4A6B",
  "#4D5560",
];

/** Three-letter code from a name: "Health" -> "HEA". */
export function deriveCode(name: string) {
  const letters = name.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase();
  return (letters.slice(0, 3) || "CAT").padEnd(3, "X");
}

export function cleanCode(code: string, name: string) {
  const c = code.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase().slice(0, 4);
  return c.length >= 2 ? c : deriveCode(name);
}

/** Creates the default categories the first time the app runs. */
export async function ensureDefaultCategories(db: PrismaClient) {
  if ((await db.category.count()) > 0) return;
  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c, i) => ({ ...c, sortOrder: i })),
    skipDuplicates: true,
  });
}
