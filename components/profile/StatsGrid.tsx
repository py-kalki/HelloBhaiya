"use client"

import { Flame, CheckSquare, HelpCircle, Target, TrendingUp } from "lucide-react"
import type { PlainUserProfile } from "@/types/student"

type Props = {
  profile: PlainUserProfile
  testsCompleted: number
}

const STAT_CONFIGS = [
  {
    key: "testsCompleted",
    icon: CheckSquare,
    label: "Tests done",
    color: "#34D399",
  },
  {
    key: "wrongQuestions",
    icon: HelpCircle,
    label: "Wrong Q's",
    color: "#F87171",
  },
  {
    key: "currentStreak",
    icon: Flame,
    label: "Current streak",
    color: "#FB923C",
  },
  {
    key: "bestStreak",
    icon: Target,
    label: "Best streak",
    color: "#D4FF59",
  },
]

export function StatsGrid({ profile, testsCompleted }: Props) {
  const values: Record<string, string | number> = {
    testsCompleted,
    wrongQuestions: profile.wrong_questions?.length ?? 0,
    currentStreak:  `${profile.streak_current ?? 0}d`,
    bestStreak:     `${profile.streak_max ?? 0}d`,
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STAT_CONFIGS.map((s) => {
        const Icon = s.icon
        const val = values[s.key]
        return (
          <div
            key={s.key}
            className="relative flex flex-col justify-between gap-5 p-5 rounded-[20px] bg-surface border border-white/6 overflow-hidden group hover:border-white/10 transition-all duration-300"
          >
            {/* subtle glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.color}0C, transparent 65%)` }}
            />

            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: `${s.color}12`, borderColor: `${s.color}25` }}
            >
              <Icon size={16} style={{ color: s.color }} />
            </div>

            <div className="relative z-10">
              <span
                className="text-[30px] font-black leading-none tracking-tight block mb-1"
                style={{ color: s.color }}
              >
                {val}
              </span>
              <span className="text-xs text-text-secondary font-medium">{s.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
