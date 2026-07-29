import { SkeletonBlock } from "@/components/Skeleton";

export default function HistoryLoading() {
  return (
    <main className="px-4 pt-6">
      <h1 className="text-xl font-extrabold tracking-tight">Last 14 Days</h1>

      <div className="mt-4 flex h-64 w-full items-end gap-1 border-2 border-ink p-2">
        {Array.from({ length: 14 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-1/3 flex-1" />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 border-2 border-ink">
        <div className="border-r border-line px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
            Avg Calories
          </div>
          <SkeletonBlock className="mt-1 h-8 w-20" />
        </div>
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
            Avg Protein
          </div>
          <SkeletonBlock className="mt-1 h-8 w-20" />
        </div>
      </div>
    </main>
  );
}
