"use client"

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

type Props = {
  data: Array<{ subject: string; accuracy: number; fullMark: number }>
}

function getColor(accuracy: number): string {
  if (accuracy >= 75) return "#90D4A8"
  if (accuracy >= 50) return "#E0C078"
  return "#E09090"
}

function CustomDot(props: {
  cx?: number
  cy?: number
  payload?: { accuracy: number }
}) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={getColor(payload.accuracy)}
      stroke="#141416"
      strokeWidth={2}
    />
  )
}

export default function WeaknessRadarChart({ data }: Props) {
  const avgAccuracy =
    data.length > 0
      ? data.reduce((s, d) => s + d.accuracy, 0) / data.length
      : 0

  const fillColor = getColor(avgAccuracy)

  return (
    <div className="scroll-x w-full">
      <div className="min-w-[260px] h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#272729" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#888888", fontSize: 11 }}
            />
            <Radar
              name="Accuracy"
              dataKey="accuracy"
              stroke={fillColor}
              fill={fillColor}
              fillOpacity={0.18}
              dot={<CustomDot />}
            />
            <Tooltip
              contentStyle={{
                background: "#141416",
                border: "1px solid #272729",
                borderRadius: 8,
                color: "#E8E8E8",
                fontSize: 12,
              }}
              formatter={(v) => [`${v ?? 0}%`, "Accuracy"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
