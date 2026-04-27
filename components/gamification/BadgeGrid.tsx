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
    icon: <Flame size={20} />,
    requiredStreak: 7,
  },
  {
    id: "streak-30",
    label: "Unstoppable",
    description: "30-day streak",
    icon: <Zap size={20} />,
    requiredStreak: 30,
  },
  {
    id: "streak-100",
    label: "Legend",
    description: "100-day streak",
    icon: <Star size={20} />,
    requiredStreak: 100,
  },
]

type Props = {
  streakMax: number
}

export function BadgeGrid({ streakMax }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
        Streak Badges
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const earned = streakMax >= badge.requiredStreak
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center ${
                earned
                  ? "border-warning/30 bg-warning/5"
                  : "border-border bg-surface opacity-50"
              }`}
            >
              {!earned && (
                <Lock
                  size={12}
                  className="absolute top-2 right-2 text-text-secondary"
                />
              )}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  earned ? "bg-warning/15 text-warning" : "bg-surface-2 text-text-secondary"
                }`}
              >
                {badge.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">{badge.label}</p>
                <p className="text-xs text-text-secondary">{badge.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
