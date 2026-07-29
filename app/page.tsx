import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, dateStamp } from "@/lib/day";
import { requireUser } from "@/lib/session";
import MacroPanel from "@/components/MacroPanel";
import MealList from "@/components/MealList";
import QuickAddBar from "@/components/QuickAddBar";

// Today's totals must never be baked at build time.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [profile, entries, favorites] = await Promise.all([
    prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    }),
    prisma.foodEntry.findMany({
      where: {
        userId: user.id,
        loggedAt: { gte: startOfDay(), lte: endOfDay() },
      },
      orderBy: { loggedAt: "asc" },
    }),
    prisma.favoriteFood.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
            {user.name} &middot; {dateStamp()}
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
      </div>

      <QuickAddBar favorites={favorites} />
      <MealList entries={entries} />
    </main>
  );
}
