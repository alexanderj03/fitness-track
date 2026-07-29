import { num } from "@/lib/format";

type GoalBarProps = {
  label: string;
  unit: string;
  consumed: number;
  goal: number;
};

/**
 * The minor macro row: carbs and fat, when goals are set for them. Deliberately
 * quieter than MacroGauge — these are reference figures, not the day's target.
 */
export default function GoalBar({
  label,
  unit,
  consumed,
  goal,
}: GoalBarProps) {
  const remaining = goal - consumed;
  const met = remaining <= 0;
  const pct = goal > 0 ? Math.min(consumed / goal, 1) * 100 : 0;

  return (
    <div className="border-b border-line py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums">
          {num(Math.abs(remaining))}
          <span className="ml-1 text-[11px] font-semibold text-ink/70">
            {unit} {met ? "over" : "to go"}
          </span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 w-full bg-line">
          <div className="h-full bg-ink/70" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-[11px] tabular-nums text-ink/70">
          {num(consumed)}/{num(goal)}
          {unit}
        </span>
      </div>
    </div>
  );
}
