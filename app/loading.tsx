import { SkeletonHeader, SkeletonPanel, SkeletonRows } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <main className="px-4 pt-6">
      <SkeletonHeader title="Today" />
      <div className="mt-4">
        <SkeletonPanel />
      </div>
      <SkeletonRows />
    </main>
  );
}
