import { APP_TIME_ZONE, startOfDay, endOfDay, timeStamp } from "@/lib/day";

/**
 * The calibration plate under the instrument: which zone the day is measured
 * in, and exactly which window "today" covers. The masthead carries the clock
 * itself. If a host's timezone is ever wrong, it shows here instead of
 * silently mis-filing entries.
 */
export default function DayWindow() {
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);

  return (
    <p
      className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70"
      title={`Today runs ${start.toISOString()} → ${end.toISOString()} (UTC)`}
    >
      <span className="whitespace-nowrap">{APP_TIME_ZONE}</span>
      <span className="whitespace-nowrap tabular-nums">
        Day {timeStamp(start)} &ndash; {timeStamp(end)}
      </span>
    </p>
  );
}
