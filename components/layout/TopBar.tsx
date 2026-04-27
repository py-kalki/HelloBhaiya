"use client"

import { Flame } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { lookupLevel } from "@/lib/scoring"

const LEVEL_XP: Record<number, number> = {
  1: 0, 5: 2_000, 10: 8_000, 15: 20_000, 20: 45_000, 30: 100_000,
}
const LEVEL_ORDER = [1, 5, 10, 15, 20, 30]

function getXPProgress(xp: number, level: number): { pct: number; current: number; next: number } {
  const idx = LEVEL_ORDER.indexOf(level)
  const currentXP = LEVEL_XP[level] ?? 0
  const nextLevel = LEVEL_ORDER[idx + 1]
  const nextXP = nextLevel !== undefined ? (LEVEL_XP[nextLevel] ?? 100_000) : 100_000
  const pct = nextXP > currentXP
    ? Math.min(100, Math.round(((xp - currentXP) / (nextXP - currentXP)) * 100))
    : 100
  return { pct, current: xp - currentXP, next: nextXP - currentXP }
}

export function TopBar() {
  const { profile } = useUserProfile()

  const xp    = profile?.xp_total ?? 0
  const level = lookupLevel(xp)
  const { pct } = getXPProgress(xp, level.level)
  const streak = profile?.streak_current ?? 0

  return (
    <header className="hidden md:flex sticky top-0 z-40 items-center justify-between px-6 h-14 border-b border-border bg-surface">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg select-none">📚</span>
        <span className="font-bold text-text-primary text-sm tracking-tight">HelloBhaiya</span>
      </div>

      {/* XP bar + level */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5 w-48">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-text-secondary font-mono">Lv.{level.level} {level.title}</span>
            <span className="text-xs text-text-secondary font-mono">{xp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-2 border border-border">
          <Flame size={14} className={streak > 0 ? "text-warning" : "text-text-secondary"} />
          <span className="text-xs font-semibold text-text-primary font-mono">{streak}</span>
        </div>
      </div>
    </header>
  )
}
