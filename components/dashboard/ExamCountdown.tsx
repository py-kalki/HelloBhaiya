"use client"

import { formatCountdown } from "@/lib/dateUtils"

const EXAM_LABELS: Record<string, string> = {
  NEET:      "NEET",
  JEE_MAINS: "JEE Mains",
  JEE_ADV:   "JEE Advanced",
  OTHER:     "Your Exam",
}

const RADIUS = 44
const CIRC = 2 * Math.PI * RADIUS

type Props = { targetDateMs: number; exam: string }

export function ExamCountdown({ targetDateMs, exam }: Props) {
  const targetDate = new Date(targetDateMs)
  const { days } = formatCountdown(targetDate)
  const examLabel = EXAM_LABELS[exam] ?? "Your Exam"

  const formattedDate = targetDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })

  // Ring fill — assume 365 day journey, show progress
  const totalJourney = 365
  const elapsed = Math.max(0, totalJourney - days)
  const pct = Math.min(elapsed / totalJourney, 1)
  const dashOffset = CIRC * (1 - pct)

  const urgency = days <= 30 ? "danger" : days <= 90 ? "warning" : "accent"
  const ringColor = urgency === "danger" ? "#F87171" : urgency === "warning" ? "#FCD34D" : "#A78BFA"
  const glowColor = urgency === "danger" ? "rgba(248,113,113,0.15)" : urgency === "warning" ? "rgba(252,211,77,0.15)" : "rgba(167,139,250,0.15)"

  return (
    <div
      className="relative bg-surface border border-border rounded-2xl p-5 overflow-hidden animate-slide-up"
      style={{ boxShadow: `0 0 40px ${glowColor}` }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-5">
        {/* SVG Ring */}
        <div className="shrink-0">
          <svg width={120} height={120} viewBox="0 0 120 120" className="-rotate-90">
            {/* Track */}
            <circle
              cx={60} cy={60} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={8}
            />
            {/* Progress */}
            <circle
              cx={60} cy={60} r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
            />
          </svg>
          {/* Days in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ width: 120, height: 120 }}>
            <span className="text-3xl font-bold text-text-primary font-mono leading-none">{days}</span>
            <span className="text-[10px] text-text-muted mt-0.5">days</span>
          </div>
        </div>

        {/* Text info */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: ringColor }}>
            {examLabel} Countdown
          </span>
          <p className="text-text-primary font-bold text-xl leading-tight">
            {days === 0 ? "Today!" : days === 1 ? "Tomorrow!" : `${days} days to go`}
          </p>
          <p className="text-text-muted text-sm">{formattedDate}</p>

          {days <= 90 && (
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ background: `${ringColor}15`, color: ringColor, border: `1px solid ${ringColor}25` }}>
              {days <= 30 ? "🔥 Final sprint" : "⚡ Less than 3 months"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
