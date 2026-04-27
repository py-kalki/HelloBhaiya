"use client"

import { useEffect, useRef, useState } from "react"
import { Zap } from "lucide-react"
import { lookupLevel } from "@/lib/scoring"

type Props = {
  xpEarned: number
  xpBefore: number
  accuracy: number
  timeTakenSeconds: number
  timerMinutes: number | null
}

export function XPEarnedDisplay({ xpEarned, xpBefore, accuracy, timeTakenSeconds, timerMinutes }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number | null>(null)

  const base = 100
  const accuracyBonus = accuracy > 80 ? 200 : accuracy >= 60 ? 100 : 0
  const speedThreshold = timerMinutes !== null ? timerMinutes * 60 * 0.7 : Infinity
  const speedBonus = timeTakenSeconds < speedThreshold ? 50 : 0

  const levelBefore = lookupLevel(xpBefore)
  const levelAfter = lookupLevel(xpBefore + xpEarned)
  const didLevelUp = levelAfter.level > levelBefore.level

  useEffect(() => {
    const start = performance.now()
    const duration = 1200

    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(eased * xpEarned))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [xpEarned])

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
      {/* XP Counter */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
          <Zap size={18} className="text-warning" />
        </div>
        <div>
          <p className="text-xs text-text-secondary">XP Earned</p>
          <p className="text-2xl font-bold text-warning font-mono">+{displayed}</p>
        </div>
        {didLevelUp && (
          <span className="ml-auto text-xs px-2 py-1 rounded-lg border border-success/30 bg-success/10 text-success font-semibold">
            Level Up! →{levelAfter.level}
          </span>
        )}
      </div>

      {/* Breakdown */}
      <div className="flex flex-col gap-1 text-xs border-t border-border pt-3">
        <div className="flex justify-between text-text-secondary">
          <span>Base XP</span>
          <span className="font-mono text-text-primary">+{base}</span>
        </div>
        {accuracyBonus > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>Accuracy bonus ({accuracy}%)</span>
            <span className="font-mono text-success">+{accuracyBonus}</span>
          </div>
        )}
        {speedBonus > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>Speed bonus</span>
            <span className="font-mono text-success">+{speedBonus}</span>
          </div>
        )}
      </div>
    </div>
  )
}
