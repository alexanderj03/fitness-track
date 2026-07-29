import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  dateStamp,
  timeStamp,
  zoneLabel,
} from "@/lib/day";
import { requireUserId } from "@/lib/session";
import { DEFAULT_GOALS } from "@/lib/goals";
import MacroPanel from "@/components/MacroPanel";
import MealList from "@/components/MealList";
import QuickAddBar from "@/components/QuickAddBar";
import DayWindow from "@/components/DayWindow";

// Today's totals must never be baked at build time.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = requireUserId();

  // One round trip to Neon, not four: the session check, the goals, today's
  // entries and the favorites all come back together.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      profile: true,
      entries: {
        where: { loggedAt: { gte: startOfDay(), lte: endOfDay() } },
        orderBy: { loggedAt: "asc" },
      },
      favorites: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/who");

  const profile = user.profile ?? DEFAULT_GOALS;
  const entries = user.entries;
  const favorites = user.favorites;

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + (entry.carbs ?? 0),
      fat: acc.fat + (entry.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <main className="px-4 pt-6">
      <header className="flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
        <div>
          <p className="flex flex-wrap gap-x-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
            <span className="whitespace-nowrap">{user.name}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap">{dateStamp()}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap tabular-nums">
              {timeStamp()} {zoneLabel()}
            </span>
          </p>
          <h1 className="text-xl font-extrabold tracking-tight">Today</h1>
        </div>
        <Link
          href="/log"
          className="flex min-h-[44px] shrink-0 items-center border border-ink px-4 text-sm font-semibold active:bg-ink active:text-paper"
        >
          + Add
        </Link>
      </header>

      <div className="mt-4">
        <MacroPanel
          entries={entries}
          calories={totals.calories}
          protein={totals.protein}
          carbs={totals.carbs}
          fat={totals.fat}
          calorieGoal={profile.calorieGoal}
          proteinGoal={profile.proteinGoal}
          carbGoal={profile.carbGoal}
          fatGoal={profile.fatGoal}
        />
        <DayWindow />
      </div>

      <QuickAddBar favorites={favorites} />
      <MealList entries={entries} />
    </main>
  );
}
