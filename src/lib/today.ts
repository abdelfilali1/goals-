import "server-only";
import { cookies } from "next/headers";
import { TZ_COOKIE, todayIn, type Day } from "./dates";

/** Today for the person using the app, based on the timezone cookie set by the browser. */
export async function getToday(): Promise<Day> {
  const store = await cookies();
  return todayIn(store.get(TZ_COOKIE)?.value ?? "UTC");
}
