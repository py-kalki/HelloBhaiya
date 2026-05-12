"use client"

import { formatCountdown } from "@/lib/dateUtils"
import { Calendar, Clock } from "lucide-react"

const EXAM_LABELS: Record<string, string> = {
  NEET:      "NEET UG",
  JEE_MAINS: "JEE Mains",
  JEE_ADV:   "JEE Advanced",
  OTHER:     "Your Exam",
}

const EXAM_COLOR: Record<string, string> = {
  NEET:      "#D4FF59",
  JEE_MAINS: "#60A5FA",
  JEE_ADV:   "#A78BFA",
  OTHER:     "#94A3B8",
}

type Props = { targetDateMs: number; exam: string }

export function ExamCountdown({ targetDateMs, exam }: Props) {
  const targetDate = new Date(targetDateMs)
  const { days } = formatCountdown(targetDate)
  const examLabel = EXAM_LABELS[exam] ?? "Your Exam"
  const color = EXAM_COLOR[exam] ?? "#94A3B8"

  const formattedDate = targetDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })

  // urgency level
  const urgency = days <= 30 ? "critical" : days <= 90 ? "soon" : "normal"
  const urgencyColor = urgency === "critical" ? "#F87171" : urgency === "soon" ? "#FB923C" : color

  // chart data
  const chartBars = [45, 60, 30, 80, 50, 90, 70]
  const days_arr = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <div className="relative min-h-[320px] bg-surface rounded-[24px] p-6 flex flex-col overflow-hidden border border-white/6">
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[24px]"
        style={{ background: `linear-gradient(90deg, transparent, ${urgencyColor}, transparent)` }}
      />

      {/* ambient glow */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: urgencyColor }}
      />

      {/* header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-text-muted" />
          <span className="text-sm font-medium text-text-secondary">Countdown</span>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold border"
          style={{ backgroundColor: `${urgencyColor}15`, borderColor: `${urgencyColor}30`, color: urgencyColor }}
        >
          {examLabel}
        </span>
      </div>

      {/* main counter */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-2">
        <div className="relative mb-1">
          <span
            className="text-[72px] font-black leading-none tracking-tighter tabular-nums"
            style={{ color: urgencyColor }}
          >
            {days}
          </span>
        </div>
        <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-medium">Days Remaining</p>
        <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-surface-2/80 border border-white/6">
          <Clock size={13} className="text-text-muted" />
          <p className="text-sm text-text-secondary font-medium">{formattedDate}</p>
        </div>
        {urgency !== "normal" && (
          <p className="mt-2 text-xs font-bold" style={{ color: urgencyColor }}>
            {urgency === "critical" ? "⚡ Final stretch!" : "🎯 Getting close!"}
          </p>
        )}
      </div>

      {/* bar chart */}
      <div className="mt-6 pt-4 border-t border-white/6 flex items-end gap-1.5 h-16 relative z-10">
        {chartBars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-surface-2 rounded-sm overflow-hidden" style={{ height: "48px" }}>
              <div
                className="w-full rounded-sm transition-all duration-700 ease-out"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${urgencyColor}90, ${urgencyColor}40)`,
                  marginTop: `${100 - h}%`
                }}
              />
            </div>
            <span className="text-[9px] text-text-muted font-medium">{days_arr[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
