import { TrendingUp } from "lucide-react"

interface Props {
  low: number
  high: number
  subjectAccuracy: Record<string, number>
}

export function PredictedScoreWidget({ low, high, subjectAccuracy }: Props) {
  const hasData = Object.keys(subjectAccuracy).length > 0

  if (!hasData) {
    return (
      <div className="bg-surface-2 border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
        <TrendingUp size={18} className="text-text-secondary shrink-0" />
        <p className="text-sm text-text-secondary">
          Take tests to unlock your predicted NEET score
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-2 border border-border rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <TrendingUp size={18} className="text-success shrink-0" />
        <div>
          <p className="text-xs text-text-secondary">Predicted NEET Score</p>
          <p className="text-text-primary font-bold text-lg leading-tight">
            {low}–{high}
            <span className="text-text-secondary font-normal text-sm"> / 720</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-text-secondary">Based on</p>
        <p className="text-xs text-text-secondary">{Object.keys(subjectAccuracy).length} subjects</p>
      </div>
    </div>
  )
}
