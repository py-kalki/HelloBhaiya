"use client"

import { Flame, Medal, Award, Trophy } from "lucide-react"

type Props = {
  currentStreak: number
  maxStreak: number
}

const STREAK_MILESTONES = [
  { days: 7, label: "Week", icon: Flame, xp: 75 },
  { days: 14, label: "Fortnight", icon: Medal, xp: 150 },
  { days: 30, label: "Month", icon: Award, xp: 300 },
  { days: 50, label: "Half Century", icon: Trophy, xp: 500 },
  { days: 100, label: "Century", icon: Trophy, xp: 1000 },
]

export function StreakBadges({ currentStreak, maxStreak }: Props) {
  const earnedBadges = STREAK_MILESTONES.filter(m => maxStreak >= m.days)
  
  if (earnedBadges.length === 0) return null

  return (
    <div className="bg-surface rounded-[28px] p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">Streak Badges</p>
          <p className="text-xs text-text-muted">Earned for consistency</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <Flame size={14} className="text-accent" />
          <span className="text-xs font-semibold text-accent">{currentStreak} day streak</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {STREAK_MILESTONES.map((milestone) => {
          const Icon = milestone.icon
          const isEarned = maxStreak >= milestone.days
          const isActive = currentStreak >= milestone.days && !isEarned
          
          return (
            <div
              key={milestone.days}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                isEarned
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : isActive
                  ? "bg-violet/10 border-violet/30 text-violet"
                  : "bg-surface-2 border-border text-text-muted"
              }`}
              title={`${milestone.label}: ${milestone.days} days`}
            >
              <Icon size={16} />
              <span className="text-xs font-medium">{milestone.days}d</span>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-text-muted">
          {earnedBadges.length} of {STREAK_MILESTONES.length} badges earned
        </span>
        <span className="text-text-secondary">
          Next: {STREAK_MILESTONES.find(m => m.days > maxStreak)?.label ?? "Complete!"}
        </span>
      </div>
    </div>
  )
}