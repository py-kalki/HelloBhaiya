interface Props {
  subject: string
  totalChapters: number
  solidChapters: number
  averageHealth: number
}

const SIZE = 64
const STROKE = 6
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

const SUBJECT_COLORS: Record<string, string> = {
  Biology:   "#90D4A8",
  Physics:   "#7EB8E0",
  Chemistry: "#E0C078",
}

export function SubjectProgressRing({ subject, totalChapters, solidChapters, averageHealth }: Props) {
  const pct = totalChapters > 0 ? averageHealth / 100 : 0
  const dash = CIRC * pct
  const gap  = CIRC - dash
  const color = SUBJECT_COLORS[subject] ?? "#888888"

  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#272729"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-text-primary">{Math.round(averageHealth)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-text-primary">{subject}</p>
        <p className="text-xs text-text-secondary">{solidChapters}/{totalChapters}</p>
      </div>
    </div>
  )
}
