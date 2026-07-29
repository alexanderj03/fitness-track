"use client";

import dynamic from "next/dynamic";

/**
 * Recharts is ~110kB — more than the rest of the app put together. Loading it
 * lazily keeps it off the critical path, so /history hydrates (and its tabs
 * start responding) before the chart code has arrived.
 */
const HistoryChart = dynamic(() => import("@/components/HistoryChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-end gap-1 border-2 border-ink p-2">
      {Array.from({ length: 14 }).map((_, index) => (
        <div key={index} className="h-1/3 flex-1 bg-line" />
      ))}
    </div>
  ),
});

export default HistoryChart;
