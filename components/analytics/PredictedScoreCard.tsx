"use client"

import { TrendingUp } from "lucide-react"

interface Props {
  low: number
  high: number
  subjectAccuracy: Record<string, number>
}

export function PredictedScoreCard({ low, high, subjectAccuracy }: Props) {
  const midpoint = Math.round((low + high) / 2)
  const percent = Math.round((midpoint / 720) * 100)

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Predicted NEET Score</h2>
      </div>

      <div className="text-center space-y-1">
        <p className="text-4xl font-bold text-text-primary font-mono">
          {low}–{high}
        </p>
        <p className="text-xs text-text-secondary">out of 720</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>0</span>
          <span>360</span>
          <span>720</span>
        </div>
      </div>

      {/* Per-subject breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(subjectAccuracy).map(([subject, acc]) => {
          const color =
            acc >= 75 ? "text-success" : acc >= 50 ? "text-warning" : "text-danger"
          return (
            <div key={subject} className="bg-surface-2 rounded-xl p-2.5 text-center">
              <p className={`text-base font-bold ${color}`}>{acc}%</p>
              <p className="text-[10px] text-text-secondary truncate mt-0.5">{subject}</p>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] text-text-secondary text-center">
        Based on rolling accuracy · assumes 80% attempt rate
      </p>
    </div>
  )
}
