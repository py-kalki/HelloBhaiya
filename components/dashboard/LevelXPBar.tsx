"use client"

import type { PlainUserProfile } from "@/types/student"
import { lookupLevel } from "@/lib/scoring"
import { Zap, Shield } from "lucide-react"

const TIERS = [
  { xp: 0,       next: 2_000,   title: "Atom",        color: "#A1A1AA" },
  { xp: 2_000,   next: 8_000,   title: "Molecule",    color: "#60A5FA" },
  { xp: 8_000,   next: 20_000,  title: "Catalyst",    color: "#A78BFA" },
  { xp: 20_000,  next: 45_000,  title: "Scholar",     color: "#34D399" },
  { xp: 45_000,  next: 100_000, title: "NEET Legend", color: "#D4FF59" },
  { xp: 100_000, next: 100_000, title: "NEET Legend", color: "#D4FF59" },
]

function getTierInfo(xp: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i]!.xp) return TIERS[i]!
  }
  return TIERS[0]!
}

type Props = { profile: PlainUserProfile }

export function LevelXPBar({ profile }: Props) {
  const { level, title } = lookupLevel(profile.xp_total)
  const tier = getTierInfo(profile.xp_total)
  const isMaxLevel = level >= 30

  const pct = isMaxLevel
    ? 100
    : Math.min(100, Math.round(((profile.xp_total - tier.xp) / (tier.next - tier.xp)) * 100))
  const xpToNext = isMaxLevel ? 0 : tier.next - profile.xp_total

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-surface/60 backdrop-blur-sm rounded-2xl border border-white/8">
      {/* Level badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{ backgroundColor: `${tier.color}15`, borderColor: `${tier.color}30` }}
        >
          <Shield size={18} style={{ color: tier.color }} />
        </div>
        <div>
          <p className="text-[11px] text-text-muted uppercase tracking-widest font-medium">Level {level}</p>
          <p className="text-sm font-bold text-text-primary leading-tight">{title}</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-text-secondary font-medium">
            <Zap size={11} style={{ color: tier.color }} />
            {profile.xp_total.toLocaleString()} XP
          </span>
          {!isMaxLevel && (
            <span className="text-text-muted">
              {xpToNext.toLocaleString()} to <span className="text-text-secondary">{tier.title}</span>
            </span>
          )}
        </div>
        <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
              boxShadow: `0 0 12px ${tier.color}50`
            }}
          />
        </div>
      </div>

      {/* Weekly XP chip */}
      <div
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
        style={{ backgroundColor: `${tier.color}12`, borderColor: `${tier.color}25`, color: tier.color }}
      >
        <Zap size={12} />
        +{profile.xp_this_week.toLocaleString()} this week
      </div>
    </div>
  )
}
