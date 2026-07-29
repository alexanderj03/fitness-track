import type { FoodEntry, MealType } from "@prisma/client";
import DeleteEntryButton from "@/components/DeleteEntryButton";
import { num } from "@/lib/format";
import { timeStamp } from "@/lib/day";

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

export default function MealList({ entries }: { entries: FoodEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="mt-6 border border-ink px-4 py-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          Nothing logged yet
        </p>
        <p className="mt-1 text-sm text-ink/70">
          Tap a quick-add above, or <span className="font-semibold">+ Add</span>{" "}
          to enter something new.
        </p>
      </div>
    );
  }

  const grouped = MEAL_ORDER.map((meal) => ({
    meal,
    items: entries.filter((e) => e.mealType === meal),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mt-6">
      {grouped.map(({ meal, items }) => {
        const mealCalories = items.reduce((sum, e) => sum + e.calories, 0);
        const mealProtein = items.reduce((sum, e) => sum + e.protein, 0);

        return (
          <section key={meal} className="mb-5">
            <h3 className="flex items-baseline justify-between gap-3 border-b border-ink pb-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
                {MEAL_LABELS[meal]}
              </span>
              <span className="text-[11px] font-semibold tabular-nums text-ink/70">
                {num(mealCalories)} kcal &middot; {num(mealProtein)}g
              </span>
            </h3>
            <ul>
              {items.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 border-b border-line py-1"
                >
                  <div className="flex min-w-0 items-baseline gap-2 py-1">
                    <time
                      dateTime={entry.loggedAt.toISOString()}
                      className="w-[52px] shrink-0 text-[11px] tabular-nums text-ink/70"
                    >
                      {timeStamp(entry.loggedAt)}
                    </time>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {entry.name}
                      </div>
                      {entry.note && (
                        <div className="truncate text-xs text-ink/70">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <div className="text-right text-xs tabular-nums text-ink/70">
                      <div>{num(entry.calories)} kcal</div>
                      <div>{num(entry.protein)}g protein</div>
                    </div>
                    <DeleteEntryButton id={entry.id} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
