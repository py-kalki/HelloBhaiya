"use client"

import { Flame, CheckSquare, HelpCircle } from "lucide-react"
import type { PlainUserProfile } from "@/types/student"

type Props = {
  profile: PlainUserProfile
  testsCompleted: number
}

export function StatsGrid({ profile, testsCompleted }: Props) {
  const stats = [
    {
      icon: <CheckSquare size={16} className="text-success" />,
      label: "Tests done",
      value: testsCompleted,
      mono: true,
    },
    {
      icon: <HelpCircle size={16} className="text-accent" />,
      label: "Wrong Q&apos;s logged",
      value: profile.wrong_questions?.length ?? 0,
      mono: true,
    },
    {
      icon: <Flame size={16} className="text-warning" />,
      label: "Current streak",
      value: `${profile.streak_current ?? 0}d`,
      mono: true,
    },
    {
      icon: <Flame size={16} className="text-danger" />,
      label: "Best streak",
      value: `${profile.streak_max ?? 0}d`,
      mono: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            {s.icon}
            <span dangerouslySetInnerHTML={{ __html: s.label }} />
          </div>
          <span className={`text-xl font-bold text-text-primary ${s.mono ? "font-mono" : ""}`}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}
