"use client"

import Link from "next/link"
import { Flame, Zap } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { lookupLevel } from "@/lib/scoring"

const LEVEL_XP: Record<number, number> = { 1: 0, 5: 2_000, 10: 8_000, 15: 20_000, 20: 45_000, 30: 100_000 }
const LEVEL_ORDER = [1, 5, 10, 15, 20, 30]

function getXPProgress(xp: number, level: number) {
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

  const xp     = profile?.xp_total ?? 0
  const level  = lookupLevel(xp)
  const { pct } = getXPProgress(xp, level.level)
  const streak = profile?.streak_current ?? 0

  return (
    <header className="hidden md:flex sticky top-0 z-40 items-center justify-between px-6 h-14 border-b border-border bg-background/90 backdrop-blur-xl">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-accent/12 border border-accent/20 flex items-center justify-center text-sm">📚</div>
        <span className="font-bold text-text-primary text-sm tracking-tight">HelloBhaiya</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* XP Progress */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-accent">
            <Zap size={13} className="fill-accent" />
            <span className="text-xs font-bold font-mono">{xp.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1 w-40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-mono">Lv.{level.level} · {level.title}</span>
              <span className="text-[10px] text-text-muted font-mono">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-violet-400 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
          streak > 0
            ? "bg-warning/8 border-warning/20 text-warning"
            : "bg-surface border-border text-text-muted"
        }`}>
          <Flame size={13} className={streak > 0 ? "fill-warning/60" : ""} />
          <span className="text-xs font-bold font-mono">{streak}</span>
          <span className="text-[10px] opacity-60">day{streak !== 1 ? "s" : ""}</span>
        </div>

        {/* Profile link */}
        <Link
          href="/profile"
          className="w-8 h-8 rounded-full bg-accent/12 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent hover:bg-accent/20 transition-colors"
        >
          {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
        </Link>
      </div>
    </header>
  )
}
