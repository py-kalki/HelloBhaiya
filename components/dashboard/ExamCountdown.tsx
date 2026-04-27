"use client"

import type { UserProfile } from "@/types/student"
import { formatCountdown } from "@/lib/dateUtils"

const EXAM_LABELS: Record<string, string> = {
  NEET:      "NEET",
  JEE_MAINS: "JEE Mains",
  JEE_ADV:   "JEE Advanced",
  OTHER:     "Your Exam",
}

type Props = { profile: UserProfile }

export function ExamCountdown({ profile }: Props) {
  const targetDate = profile.target_date.toDate()
  const { days } = formatCountdown(targetDate)
  const examLabel = EXAM_LABELS[profile.exam] ?? "Your Exam"

  const formattedDate = targetDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-1">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-widest">
        {examLabel} Countdown
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-text-primary font-mono">{days}</span>
        <span className="text-text-secondary text-lg">days to go</span>
      </div>
      <p className="text-text-secondary text-sm">{formattedDate}</p>
    </div>
  )
}
