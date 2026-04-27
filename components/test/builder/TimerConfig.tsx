"use client"

import { Clock } from "lucide-react"

type Props = {
  timerMinutes: number | null
  questionCount: number
  onChange: (minutes: number | null) => void
  disabled?: boolean
}

export function TimerConfig({ timerMinutes, questionCount, onChange, disabled }: Props) {
  const isOn = timerMinutes !== null
  const suggested = Math.ceil(questionCount * 1.5)

  function handleToggle() {
    if (disabled) return
    onChange(isOn ? null : suggested)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text-primary">
          <Clock size={16} className="text-text-secondary" />
          <span>Timed Test</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          onClick={handleToggle}
          disabled={disabled}
          className={`relative w-10 h-6 rounded-full transition-colors disabled:opacity-40 ${
            isOn ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
              isOn ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Minutes input */}
      {isOn && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={5}
            max={360}
            value={timerMinutes ?? suggested}
            disabled={disabled}
            onChange={(e) => onChange(Math.max(5, Math.min(360, Number(e.target.value))))}
            className="w-20 bg-surface-2 border border-border rounded-lg px-3 py-2 text-text-primary text-sm font-mono text-center focus:outline-none focus:border-accent"
          />
          <span className="text-sm text-text-secondary">minutes</span>
          <button
            type="button"
            onClick={() => onChange(suggested)}
            className="text-xs text-text-secondary underline-offset-2 hover:text-text-primary transition-colors"
          >
            Use suggested ({suggested}m)
          </button>
        </div>
      )}
    </div>
  )
}
