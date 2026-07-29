import { SkeletonBlock, SkeletonRows } from "@/components/Skeleton";

const GOAL_FIELDS = [
  "Calorie Goal",
  "Protein Goal (g)",
  "Carb Goal (g)",
  "Fat Goal (g)",
];

export default function SettingsLoading() {
  return (
    <main className="px-4 pt-6">
      <header className="border-b-2 border-ink pb-2">
        <SkeletonBlock className="h-[11px] w-36" />
        <h1 className="mt-1 text-xl font-extrabold tracking-tight">Settings</h1>
      </header>

      <h2 className="mt-6 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
        Daily Goals
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {GOAL_FIELDS.map((field) => (
          <div key={field}>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
              {field}
            </span>
            <SkeletonBlock className="mt-1 h-[38px] w-full border border-line" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mt-4 h-12 w-full" />

      <h2 className="mt-8 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
        Favorites
      </h2>
      <SkeletonRows count={2} />
    </main>
  );
}
