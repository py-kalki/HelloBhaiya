"use client"

import { Flame, CheckSquare, HelpCircle, Target } from "lucide-react"
import type { PlainUserProfile } from "@/types/student"

type Props = {
  profile: PlainUserProfile
  testsCompleted: number
}

export function StatsGrid({ profile, testsCompleted }: Props) {
  const stats = [
    {
      icon: <CheckSquare size={16} className="text-white" />,
      label: "Tests done",
      value: testsCompleted,
    },
    {
      icon: <HelpCircle size={16} className="text-white" />,
      label: "Wrong Q's",
      value: profile.wrong_questions?.length ?? 0,
    },
    {
      icon: <Flame size={16} className="text-white" />,
      label: "Current streak",
      value: `${profile.streak_current ?? 0}d`,
    },
    {
      icon: <Target size={16} className="text-white" />,
      label: "Best streak",
      value: `${profile.streak_max ?? 0}d`,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col justify-between gap-4 p-5 rounded-[24px] bg-surface">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {s.icon}
          </div>
          <div>
            <span className="text-[28px] font-medium leading-none tracking-tight text-text-primary block mb-1">
              {s.value}
            </span>
            <span className="text-xs text-text-secondary font-medium">
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
