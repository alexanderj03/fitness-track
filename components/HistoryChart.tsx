"use client";

import {
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DayPoint = { label: string; calories: number; protein: number };

export default function HistoryChart({
  data,
  calorieGoal,
  proteinGoal,
}: {
  data: DayPoint[];
  calorieGoal: number;
  proteinGoal: number;
}) {
  return (
    <div className="h-64 w-full border-2 border-ink p-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#14140F" }}
            axisLine={{ stroke: "#14140F" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="calories"
            tick={{ fontSize: 11, fill: "#14140F" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis yAxisId="protein" hide />
          <Tooltip
            contentStyle={{
              background: "#FAFAF7",
              border: "1px solid #14140F",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            yAxisId="calories"
            y={calorieGoal}
            stroke="#C97A2E"
            strokeDasharray="4 4"
          />
          <ReferenceLine
            yAxisId="protein"
            y={proteinGoal}
            stroke="#3F6B3E"
            strokeDasharray="4 4"
          />
          <Bar yAxisId="calories" dataKey="calories" fill="#C97A2E" barSize={14} />
          <Line
            yAxisId="protein"
            type="monotone"
            dataKey="protein"
            stroke="#3F6B3E"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
