"use client"

import { CheckCircle2, XCircle, Minus, Clock, Zap } from "lucide-react"

type Props = {
  correct: number
  wrong: number
  unattempted: number
  timeTakenSeconds: number
  timerMinutes: number | null
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function PerformanceCards({
  correct,
  wrong,
  unattempted,
  timeTakenSeconds,
  timerMinutes,
}: Props) {
  const speedThreshold = timerMinutes !== null ? timerMinutes * 60 * 0.7 : Infinity
  const gotSpeedBonus = timeTakenSeconds < speedThreshold

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-3 p-3 rounded-xl border border-success/30 bg-success/5">
        <CheckCircle2 size={20} className="text-success shrink-0" />
        <div>
          <p className="text-xs text-text-secondary">Correct</p>
          <p className="text-xl font-bold text-success font-mono">{correct}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl border border-danger/30 bg-danger/5">
        <XCircle size={20} className="text-danger shrink-0" />
        <div>
          <p className="text-xs text-text-secondary">Wrong</p>
          <p className="text-xl font-bold text-danger font-mono">{wrong}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
        <Minus size={20} className="text-text-secondary shrink-0" />
        <div>
          <p className="text-xs text-text-secondary">Skipped</p>
          <p className="text-xl font-bold text-text-primary font-mono">{unattempted}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
        <Clock size={20} className="text-text-secondary shrink-0" />
        <div>
          <p className="text-xs text-text-secondary">Time taken</p>
          <p className="text-sm font-bold text-text-primary font-mono">{formatTime(timeTakenSeconds)}</p>
          {gotSpeedBonus && (
            <span className="flex items-center gap-0.5 text-xs text-success">
              <Zap size={10} /> Speed bonus!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
