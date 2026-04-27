"use client"

import { lookupLevel } from "@/lib/scoring"

const LEVEL_MILESTONES = [0, 2_000, 8_000, 20_000, 45_000, 100_000]

function getNextLevelXP(xp: number): number {
  for (const threshold of LEVEL_MILESTONES) {
    if (xp < threshold) return threshold
  }
  return LEVEL_MILESTONES[LEVEL_MILESTONES.length - 1]!
}

function getPrevLevelXP(xp: number): number {
  let prev = 0
  for (const threshold of LEVEL_MILESTONES) {
    if (xp < threshold) return prev
    prev = threshold
  }
  return prev
}

type Props = {
  xp: number
  showNumbers?: boolean
  className?: string
}

export function XPProgressBar({ xp, showNumbers = true, className = "" }: Props) {
  const { level, title } = lookupLevel(xp)
  const prevXP = getPrevLevelXP(xp)
  const nextXP = getNextLevelXP(xp)
  const fraction = nextXP > prevXP ? (xp - prevXP) / (nextXP - prevXP) : 1
  const pct = Math.min(Math.round(fraction * 100), 100)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showNumbers && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">
            Lv.{level} <span className="text-text-primary font-semibold">{title}</span>
          </span>
          <span className="text-text-secondary font-mono">
            {xp.toLocaleString()} / {nextXP.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
