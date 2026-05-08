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
  if (accuracy >= 75) return "#6EE7B7"
  if (accuracy >= 50) return "#FCD34D"
  return "#F87171"
}

function CustomDot(props: {
  cx?: number
  cy?: number
  payload?: { accuracy: number }
}) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload) return null
  const color = getColor(payload.accuracy)
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="#0D0D0D"
      strokeWidth={2}
      style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
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
    <div className="w-full">
      <div className="min-w-[240px] h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#666666", fontSize: 10, fontWeight: 600 }}
            />
            <Radar
              name="Accuracy"
              dataKey="accuracy"
              stroke={fillColor}
              fill={fillColor}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={<CustomDot />}
            />
            <Tooltip
              contentStyle={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#E8E8E8",
                fontSize: 11,
                fontWeight: 600,
                padding: "8px 12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
              formatter={(v) => [`${v ?? 0}%`, "Accuracy"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
