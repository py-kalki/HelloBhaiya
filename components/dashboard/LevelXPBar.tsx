"use client"

import type { PlainUserProfile } from "@/types/student"
import { lookupLevel } from "@/lib/scoring"
import { Zap, Shield } from "lucide-react"

function getNextLevelXP(currentXp: number): { threshold: number; next: number; title: string } {
  const tiers = [
    { xp: 0,       next: 2_000,   title: "Atom" },
    { xp: 2_000,   next: 8_000,   title: "Molecule" },
    { xp: 8_000,   next: 20_000,  title: "Catalyst" },
    { xp: 20_000,  next: 45_000,  title: "Scholar" },
    { xp: 45_000,  next: 100_000, title: "NEET Legend" },
    { xp: 100_000, next: 100_000, title: "NEET Legend" },
  ]
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (currentXp >= tiers[i]!.xp) {
      return { threshold: tiers[i]!.xp, next: tiers[i]!.next, title: tiers[i]!.title }
    }
  }
  return { threshold: 0, next: 2_000, title: "Atom" }
}

type Props = { profile: PlainUserProfile }

export function LevelXPBar({ profile }: Props) {
  const { level, title } = lookupLevel(profile.xp_total)
  const { threshold, next, title: nextTitle } = getNextLevelXP(profile.xp_total)
  const isMaxLevel = level >= 30
  const pct = isMaxLevel ? 100 : Math.min(100, Math.round(((profile.xp_total - threshold) / (next - threshold)) * 100))
  const xpToNext = isMaxLevel ? 0 : next - profile.xp_total

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-surface rounded-2xl border border-border">
      {/* Level badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Shield size={18} className="text-accent" />
        </div>
        <div>
          <p className="text-xs text-text-secondary font-medium">Level {level}</p>
          <p className="text-sm font-bold text-text-primary">{title}</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
            <Zap size={11} className="text-accent" />
            {profile.xp_total.toLocaleString()} XP
          </span>
          {!isMaxLevel && (
            <span className="text-xs text-text-muted">
              {xpToNext.toLocaleString()} XP to <span className="text-text-secondary">{nextTitle}</span>
            </span>
          )}
        </div>
        <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Weekly XP badge */}
      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-xl">
        <Zap size={13} className="text-accent" />
        <span className="text-xs font-semibold text-accent">+{profile.xp_this_week.toLocaleString()} this week</span>
      </div>
    </div>
  )
}
