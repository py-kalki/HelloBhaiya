"use client"

import { Flame, Lock, Star, Zap } from "lucide-react"

type Badge = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  requiredStreak: number
}

const BADGES: Badge[] = [
  {
    id: "streak-7",
    label: "On Fire",
    description: "7-day streak",
    icon: <Flame size={24} />,
    requiredStreak: 7,
  },
  {
    id: "streak-30",
    label: "Unstoppable",
    description: "30-day streak",
    icon: <Zap size={24} />,
    requiredStreak: 30,
  },
  {
    id: "streak-100",
    label: "Legend",
    description: "100-day streak",
    icon: <Star size={24} />,
    requiredStreak: 100,
  },
]

type Props = {
  streakMax: number
}

export function BadgeGrid({ streakMax }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight text-text-primary px-1">
        Badges
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const earned = streakMax >= badge.requiredStreak
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-[28px] text-center ${
                earned
                  ? "bg-violet/10 text-violet"
                  : "bg-surface opacity-50"
              }`}
            >
              {!earned && (
                <Lock
                  size={16}
                  className="absolute top-4 right-4 text-text-secondary"
                />
              )}
              <div
                className={`w-16 h-16 rounded-[20px] flex items-center justify-center ${
                  earned ? "bg-violet text-white shadow-[0_0_20px_rgba(162,123,250,0.4)]" : "bg-surface-2 text-text-secondary"
                }`}
              >
                {badge.icon}
              </div>
              <div>
                <p className={`text-base font-bold ${earned ? "text-text-primary" : "text-text-secondary"}`}>{badge.label}</p>
                <p className="text-xs text-text-secondary mt-1">{badge.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
