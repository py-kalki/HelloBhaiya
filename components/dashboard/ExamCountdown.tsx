"use client"

import { formatCountdown } from "@/lib/dateUtils"
import { Calendar, ChevronDown } from "lucide-react"

const EXAM_LABELS: Record<string, string> = {
  NEET:      "NEET",
  JEE_MAINS: "JEE Mains",
  JEE_ADV:   "JEE Advanced",
  OTHER:     "Your Exam",
}

type Props = { targetDateMs: number; exam: string }

export function ExamCountdown({ targetDateMs, exam }: Props) {
  const targetDate = new Date(targetDateMs)
  const { days } = formatCountdown(targetDate)
  const examLabel = EXAM_LABELS[exam] ?? "Your Exam"

  const formattedDate = targetDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })

  // Simulated chart data for the "Time visit" aesthetic from the image
  const chartBars = [45, 60, 30, 80, 50, 90, 70]

  return (
    <div className="relative h-full min-h-[300px] bg-surface rounded-[28px] p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">Countdown</span>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-text-primary">
          {examLabel} <ChevronDown size={14} className="text-text-muted" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center">
          {/* Main metric */}
          <div className="relative">
            <span className="text-[64px] font-medium leading-none tracking-tighter text-text-primary">
              {days}
            </span>
            {/* Overlay pill like the chart tooltip in image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-black text-xs font-bold whitespace-nowrap shadow-[0_0_20px_rgba(212,255,89,0.3)]">
              +{Math.round(days/30)} months
            </div>
          </div>
          <p className="text-text-muted text-sm mt-4 uppercase tracking-widest">Days Remaining</p>
          <p className="text-text-secondary text-base mt-2">{formattedDate}</p>
        </div>
      </div>

      {/* Decorative Bar Chart representing "progress" */}
      <div className="mt-8 pt-6 border-t border-border flex items-end justify-between h-24 gap-2">
        {chartBars.map((height, i) => (
          <div key={i} className="w-full flex flex-col gap-2 items-center group relative">
            <div className="w-full bg-surface-2 rounded-t-md rounded-b-sm overflow-hidden h-full flex items-end">
              <div 
                className="w-full bg-violet rounded-t-md rounded-b-sm transition-all duration-500 ease-out group-hover:bg-accent"
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-[10px] text-text-muted font-medium">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
