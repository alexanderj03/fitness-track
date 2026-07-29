import { SkeletonBlock } from "@/components/Skeleton";

const FIELDS = ["Name", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)", "Note"];

export default function LogLoading() {
  return (
    <main className="px-4 pt-6">
      <h1 className="text-xl font-extrabold tracking-tight">Log Food</h1>
      <div className="mt-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field}>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
              {field}
            </span>
            <SkeletonBlock className="mt-1 h-[38px] w-full border border-line" />
          </div>
        ))}
        <SkeletonBlock className="h-12 w-full" />
      </div>
    </main>
  );
}
