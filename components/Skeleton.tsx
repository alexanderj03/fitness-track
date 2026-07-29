/**
 * Loading placeholders, printed rather than shimmering: the instrument is drawn
 * in full — frames, rules, eyebrow labels — and only the values are blank. The
 * page never reflows when the data lands, and nothing pulses or glows, because
 * this system has no such vocabulary.
 */

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`block bg-line ${className}`} aria-hidden="true" />;
}

export function SkeletonHeader({ title }: { title: string }) {
  return (
    <header className="flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
      <div>
        <SkeletonBlock className="h-[11px] w-40" />
        <h1 className="mt-1 text-xl font-extrabold tracking-tight">{title}</h1>
      </div>
      <SkeletonBlock className="h-11 w-20" />
    </header>
  );
}

/** One MacroGauge with its label and scale in place, values pending. */
function SkeletonGauge({ label }: { label: string }) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {label}
        </span>
        <SkeletonBlock className="h-[11px] w-24" />
      </div>
      <SkeletonBlock className="mt-1 h-[2.75rem] w-32" />
      <div className="mt-3 h-4 w-full border border-ink bg-line" />
      <div className="h-2" />
    </div>
  );
}

export function SkeletonPanel() {
  return (
    <div className="border-2 border-ink bg-paper px-4 pt-3 pb-1">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">Daily Values</h2>
        <SkeletonBlock className="h-[11px] w-16" />
      </div>
      <div className="mt-1 border-b-4 border-ink" />
      <SkeletonGauge label="Calories" />
      <SkeletonGauge label="Protein" />
    </div>
  );
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <ul className="mt-6">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-3 border-b border-line py-3"
        >
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
