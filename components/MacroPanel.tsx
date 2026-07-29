import type { FoodEntry } from "@prisma/client";
import GoalBar from "@/components/GoalBar";
import MacroGauge from "@/components/MacroGauge";

type MacroPanelProps = {
  entries: FoodEntry[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number | null;
  fatGoal: number | null;
};

export default function MacroPanel({
  entries,
  calories,
  protein,
  carbs,
  fat,
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
}: MacroPanelProps) {
  const calorieSegments = entries.map((entry) => ({
    id: entry.id,
    label: entry.name,
    value: entry.calories,
  }));
  const proteinSegments = entries.map((entry) => ({
    id: entry.id,
    label: entry.name,
    value: entry.protein,
  }));

  const hasMinor = carbGoal != null || fatGoal != null;

  return (
    <div className="border-2 border-ink bg-paper px-4 pt-3 pb-1">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">Daily Values</h2>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <div className="mt-1 border-b-4 border-ink" />

      <MacroGauge
        label="Calories"
        unit=""
        consumed={calories}
        goal={calorieGoal}
        segments={calorieSegments}
        fillClass="bg-calorie"
        overIsWarning
      />
      <MacroGauge
        label="Protein"
        unit="g"
        consumed={protein}
        goal={proteinGoal}
        segments={proteinSegments}
        fillClass="bg-protein"
      />

      {hasMinor && (
        <div className="border-t-2 border-ink">
          {carbGoal != null && (
            <GoalBar label="Carbs" unit="g" consumed={carbs} goal={carbGoal} />
          )}
          {fatGoal != null && (
            <GoalBar label="Fat" unit="g" consumed={fat} goal={fatGoal} />
          )}
        </div>
      )}
    </div>
  );
}
