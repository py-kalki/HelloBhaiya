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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
            <span className="text-sm font-bold text-text-primary">{level.level}</span>
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold tracking-tight">{level.title}</p>
            <p className="text-text-secondary text-xs">Level {level.level}</p>
          </div>
        </div>
        {nextLevel !== undefined && (
          <div className="text-right">
            <p className="text-text-secondary text-xs">Next level</p>
            <p className="text-text-primary text-sm font-semibold tracking-tight">{lookupLevel(toXP).title}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 rounded-full bg-surface-2 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-accent transition-all duration-1000 relative"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
          <span>{(xp - fromXP).toLocaleString()} XP</span>
          <span className="text-accent font-bold">{pct}%</span>
          <span>{(toXP - fromXP).toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  )
}
