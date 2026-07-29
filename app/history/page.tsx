import { prisma } from "@/lib/prisma";
import { lastNDays, startOfDay, endOfDay, dayKey, shortWeekday } from "@/lib/day";
import { requireUser } from "@/lib/session";
import HistoryChart from "@/components/HistoryChart";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser();

  const days = lastNDays(14);
  const rangeStart = startOfDay(days[0]);
  const rangeEnd = endOfDay(days[days.length - 1]);

  const [profile, entries] = await Promise.all([
    prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    }),
    prisma.foodEntry.findMany({
      where: { userId: user.id, loggedAt: { gte: rangeStart, lte: rangeEnd } },
    }),
  ]);

  const totalsByDay = new Map<string, { calories: number; protein: number }>();
  for (const day of days) {
    totalsByDay.set(dayKey(day), { calories: 0, protein: 0 });
  }
  for (const entry of entries) {
    const key = dayKey(entry.loggedAt);
    const bucket = totalsByDay.get(key);
    if (bucket) {
      bucket.calories += entry.calories;
      bucket.protein += entry.protein;
    }
  }

  const chartData = days.map((day) => {
    const totals = totalsByDay.get(dayKey(day))!;
    return {
      label: shortWeekday(day),
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
    };
  });

  const avgCalories = Math.round(
    chartData.reduce((sum, d) => sum + d.calories, 0) / chartData.length,
  );
  const avgProtein = Math.round(
    chartData.reduce((sum, d) => sum + d.protein, 0) / chartData.length,
  );

  return (
    <main className="px-4 pt-6">
      <h1 className="text-xl font-extrabold tracking-tight">Last 14 Days</h1>

      <div className="mt-4">
        <HistoryChart
          data={chartData}
          calorieGoal={profile.calorieGoal}
          proteinGoal={profile.proteinGoal}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 border-2 border-ink">
        <div className="border-r border-line px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink/60">
            Avg Calories
          </div>
          <div className="text-2xl font-bold tabular-nums">{avgCalories}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink/60">
            Avg Protein
          </div>
          <div className="text-2xl font-bold tabular-nums">{avgProtein}g</div>
        </div>
      </div>
    </main>
  );
}
