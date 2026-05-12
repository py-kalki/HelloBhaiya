"use client"

import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import type { PlainUserProfile } from "@/types/student"
import { Zap, TrendingUp, Star } from "lucide-react"

type Props = { profile: PlainUserProfile }

export function XPStats({ profile }: Props) {
  const weeklyXp = profile.xp_this_week ?? 0
  const totalXp = profile.xp_total ?? 0

  // rough daily avg from weekly
  const dailyAvg = Math.round(weeklyXp / 7)

  return (
    <div className="flex flex-col gap-5 p-6 rounded-[24px] bg-surface border border-white/6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Zap size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">XP Progress</p>
            <p className="text-[11px] text-text-secondary">Level progression</p>
          </div>
        </div>
        <span className="text-sm font-bold text-accent">{totalXp.toLocaleString()}</span>
      </div>

      <XPProgressBar xp={totalXp} />

      {/* stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-2 border border-white/5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-accent" />
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">This Week</span>
          </div>
          <span className="text-lg font-black text-accent">+{weeklyXp.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-2 border border-white/5">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-violet" />
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Daily avg</span>
          </div>
          <span className="text-lg font-black text-violet">+{dailyAvg.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
