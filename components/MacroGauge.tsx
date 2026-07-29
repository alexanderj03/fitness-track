import { num, pct } from "@/lib/format";

export type GaugeSegment = { id: string; label: string; value: number };

type MacroGaugeProps = {
  label: string;
  unit: string;
  consumed: number;
  goal: number;
  /** One bar segment per logged entry, in the order they were eaten. */
  segments: GaugeSegment[];
  fillClass: string;
  /** Calories flip to the over colour past goal; protein never does. */
  overIsWarning?: boolean;
};

const TICKS = Array.from({ length: 11 }, (_, i) => i * 10);

export default function MacroGauge({
  label,
  unit,
  consumed,
  goal,
  segments,
  fillClass,
  overIsWarning = false,
}: MacroGaugeProps) {
  const remaining = goal - consumed;
  const met = remaining <= 0;
  const percent = pct(consumed, goal);
  const warn = overIsWarning && met;

  // Segments are laid out against the goal and clipped at it, so the track's
  // right edge always means "goal", never "total eaten".
  let used = 0;
  const bars = segments.reduce<{ id: string; label: string; width: number }[]>(
    (acc, segment) => {
      const room = Math.max(goal - used, 0);
      const width = Math.min(segment.value, room);
      used += segment.value;
      if (width > 0 && goal > 0) {
        acc.push({
          id: segment.id,
          label: segment.label,
          width: (width / goal) * 100,
        });
      }
      return acc;
    },
    [],
  );

  return (
    <section className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {label}
        </h3>
        <p className="text-[11px] tabular-nums text-ink/70">
          {num(consumed)} / {num(goal)}
          {unit} &middot; {percent}%
        </p>
      </div>

      <div className="mt-1 flex items-end justify-between gap-3">
        <p
          className={`text-[2.75rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums ${
            warn ? "text-over" : "text-ink"
          }`}
        >
          {num(Math.abs(remaining))}
          <span className="ml-1.5 align-baseline text-base font-semibold tracking-normal">
            {unit} {met ? "over" : "to go"}
          </span>
        </p>

        {met && (
          <span
            className={`mb-1 shrink-0 border px-1.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.14em] ${
              warn ? "border-over text-over" : "border-ink text-ink"
            }`}
          >
            {warn ? "Over" : "Goal met"}
          </span>
        )}
      </div>

      <div className="mt-3 flex h-4 w-full border border-ink bg-line">
        {bars.map((bar) => (
          <div
            key={bar.id}
            title={bar.label}
            style={{ width: `${bar.width}%` }}
            className={`h-full border-r border-paper last:border-r-0 ${
              warn ? "bg-over" : fillClass
            }`}
          />
        ))}
      </div>

      <div className="relative h-2" aria-hidden="true">
        {TICKS.map((tick) => (
          <span
            key={tick}
            style={{ left: `${tick}%`, height: tick % 50 === 0 ? 8 : 4 }}
            className="absolute top-0 w-px -translate-x-px bg-ink/45"
          />
        ))}
      </div>

      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.1em] tabular-nums text-ink/70">
        <span>0</span>
        <span>{num(goal / 2)}</span>
        <span>
          {num(goal)}
          {unit}
        </span>
      </div>
    </section>
  );
}
