"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = {
  label: string
  accuracy: number
}

type Props = {
  data: DataPoint[]
}

export default function PerformanceTrendChartInner({ data }: Props) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid stroke="#272729" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#888888", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#888888", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#141416",
              border: "1px solid #272729",
              borderRadius: 8,
              color: "#E8E8E8",
              fontSize: 12,
            }}
            formatter={(v) => [`${v}%`, "Accuracy"]}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#90D4A8"
            strokeWidth={2}
            dot={{ fill: "#90D4A8", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
