"use client"

import { lookupLevel } from "@/lib/scoring"

const LEVEL_MILESTONES = [0, 2_000, 8_000, 20_000, 45_000, 100_000]
const LEVEL_KEYS       = [1, 5, 10, 15, 20, 30]

function getProgress(xp: number) {
  let fromXP = 0, toXP = LEVEL_MILESTONES[1]!
  for (let i = 0; i < LEVEL_MILESTONES.length - 1; i++) {
    if (xp < LEVEL_MILESTONES[i + 1]!) {
      fromXP = LEVEL_MILESTONES[i]!
      toXP   = LEVEL_MILESTONES[i + 1]!
      break
    }
    if (i === LEVEL_MILESTONES.length - 2) {
      fromXP = LEVEL_MILESTONES[i + 1]!
      toXP   = LEVEL_MILESTONES[i + 1]!
    }
  }
  const fraction = toXP > fromXP ? Math.min((xp - fromXP) / (toXP - fromXP), 1) : 1
  return { fraction, fromXP, toXP }
}

type Props = { xp: number }

export function XPProgressBar({ xp }: Props) {
  const level  = lookupLevel(xp)
  const { fraction, fromXP, toXP } = getProgress(xp)
  const pct = Math.round(fraction * 100)

  const idx = LEVEL_KEYS.indexOf(level.level)
  const nextLevel = LEVEL_KEYS[idx + 1]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/12 border border-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{level.level}</span>
          </div>
          <div>
            <p className="text-text-primary text-xs font-bold">{level.title}</p>
            <p className="text-text-muted text-[10px]">Level {level.level}</p>
          </div>
        </div>
        {nextLevel !== undefined && (
          <div className="text-right">
            <p className="text-text-muted text-[10px]">Next level</p>
            <p className="text-text-primary text-xs font-bold">{lookupLevel(toXP).title}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-3 rounded-full bg-surface-2 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent via-violet-400 to-indigo-400 transition-all duration-1000 relative"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
          <span>{(xp - fromXP).toLocaleString()} XP</span>
          <span className="text-accent font-semibold">{pct}%</span>
          <span>{(toXP - fromXP).toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  )
}
