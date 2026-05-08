"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export type AccuracyDataPoint = {
  label: string
  Biology?: number
  Physics?: number
  Chemistry?: number
  Mathematics?: number
}

interface Props {
  data: AccuracyDataPoint[]
}

const SUBJECT_COLORS: Record<string, string> = {
  Biology:     "#90D4A8",
  Physics:     "#7EB8E0",
  Chemistry:   "#E0C078",
  Mathematics: "#E09090",
}

export function SubjectAccuracyChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-text-secondary text-sm">
        Complete at least 2 tests to see trends
      </div>
    )
  }

  const subjects = Object.keys(SUBJECT_COLORS).filter((s) =>
    data.some((d) => d[s as keyof AccuracyDataPoint] !== undefined)
  )

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "320px" }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#272729" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#888888", fontSize: 10 }}
              axisLine={{ stroke: "#272729" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#888888", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1A1A1E",
                border: "1px solid #272729",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#E8E8E8",
              }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#888888" }}
              iconType="circle"
              iconSize={8}
            />
            {subjects.map((subject) => (
              <Line
                key={subject}
                type="monotone"
                dataKey={subject}
                stroke={SUBJECT_COLORS[subject] ?? "#888888"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
