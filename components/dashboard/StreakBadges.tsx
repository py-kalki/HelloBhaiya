"use client"

import { Flame, Medal, Award, Trophy, Lock } from "lucide-react"

type Props = {
  currentStreak: number
  maxStreak: number
}

const MILESTONES = [
  { days: 7,   label: "Week",         icon: Flame,  color: "#FB923C", xp: 75 },
  { days: 14,  label: "Fortnight",    icon: Medal,  color: "#60A5FA", xp: 150 },
  { days: 30,  label: "Month",        icon: Award,  color: "#A78BFA", xp: 300 },
  { days: 50,  label: "Half Century", icon: Trophy, color: "#F59E0B", xp: 500 },
  { days: 100, label: "Century",      icon: Trophy, color: "#D4FF59", xp: 1000 },
]

export function StreakBadges({ currentStreak, maxStreak }: Props) {
  const earned = MILESTONES.filter(m => maxStreak >= m.days)

  return (
    <div className="bg-surface rounded-[24px] p-5 border border-white/6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text-primary">Streak Milestones</p>
          <p className="text-xs text-text-muted mt-0.5">{earned.length}/{MILESTONES.length} badges unlocked</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
          style={{ backgroundColor: "#FB923C15", borderColor: "#FB923C30" }}>
          <Flame size={13} style={{ color: "#FB923C" }} />
          <span className="text-xs font-bold" style={{ color: "#FB923C" }}>{currentStreak}d streak</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-2">
        {MILESTONES.map((m) => {
          const Icon = m.icon
          const isEarned = maxStreak >= m.days
          const isCurrent = !isEarned && currentStreak > 0

          return (
            <div
              key={m.days}
              className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl border transition-all duration-300"
              style={{
                backgroundColor: isEarned ? `${m.color}12` : "transparent",
                borderColor: isEarned ? `${m.color}30` : "rgba(255,255,255,0.06)",
                opacity: isEarned ? 1 : 0.45
              }}
              title={`${m.label}: ${m.days} days streak`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isEarned ? `${m.color}20` : "rgba(255,255,255,0.05)",
                }}
              >
                {isEarned
                  ? <Icon size={18} style={{ color: m.color }} />
                  : <Lock size={14} className="text-text-muted" />
                }
              </div>
              <span className="text-[10px] font-bold text-center leading-tight"
                style={{ color: isEarned ? m.color : "var(--text-muted)" }}>
                {m.days}d
              </span>
              <span className="text-[9px] text-text-muted text-center leading-tight hidden sm:block">
                {m.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Next milestone progress */}
      {earned.length < MILESTONES.length && (() => {
        const next = MILESTONES[earned.length]!
        const prev = earned.length > 0 ? MILESTONES[earned.length - 1]!.days : 0
        const pct = Math.min(100, ((currentStreak - prev) / (next.days - prev)) * 100)
        return (
          <div className="mt-4 pt-4 border-t border-white/6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-text-muted">Next: <span className="text-text-secondary">{next.label}</span></span>
              <span className="text-text-muted">{Math.max(0, next.days - currentStreak)}d remaining</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: next.color, boxShadow: `0 0 8px ${next.color}50` }}
              />
            </div>
          </div>
        )
      })()}
    </div>
  )
}