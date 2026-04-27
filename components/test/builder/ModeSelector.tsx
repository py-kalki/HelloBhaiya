"use client"

import type { TestMode } from "@/types/question"

const MODES: { value: TestMode; label: string; description: string }[] = [
  { value: "CUSTOM", label: "Standard", description: "Pick subjects, chapters & difficulty" },
  { value: "PYQ", label: "PYQ", description: "Previous year questions only" },
  { value: "RAPID_FIRE", label: "Rapid Fire", description: "30 seconds per question" },
  { value: "MISTAKE_REPLAY", label: "Mistakes", description: "Redo your wrong answers" },
]

type Props = {
  value: TestMode
  onChange: (mode: TestMode) => void
  pyqYearRange: [number, number]
  onPyqYearRangeChange: (range: [number, number]) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const EARLIEST_YEAR = 2000

export function ModeSelector({ value, onChange, pyqYearRange, onPyqYearRangeChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`flex flex-col gap-0.5 p-3 rounded-xl border text-left transition-colors min-h-[44px] ${
              value === mode.value
                ? "border-accent bg-accent/5 text-text-primary"
                : "border-border text-text-secondary hover:border-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="text-sm font-semibold">{mode.label}</span>
            <span className="text-xs opacity-70">{mode.description}</span>
          </button>
        ))}
      </div>

      {/* PYQ year range — shown only in PYQ mode */}
      {value === "PYQ" && (
        <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-border">
          <span className="text-xs text-text-secondary shrink-0">Year range</span>
          <select
            value={pyqYearRange[0]}
            onChange={(e) =>
              onPyqYearRangeChange([Number(e.target.value), pyqYearRange[1]])
            }
            className="flex-1 bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            {Array.from(
              { length: CURRENT_YEAR - EARLIEST_YEAR + 1 },
              (_, i) => EARLIEST_YEAR + i,
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-secondary">to</span>
          <select
            value={pyqYearRange[1]}
            onChange={(e) =>
              onPyqYearRangeChange([pyqYearRange[0], Number(e.target.value)])
            }
            className="flex-1 bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            {Array.from(
              { length: CURRENT_YEAR - EARLIEST_YEAR + 1 },
              (_, i) => EARLIEST_YEAR + i,
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info banners for special modes */}
      {value === "RAPID_FIRE" && (
        <p className="text-xs text-warning bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
          Timer is locked to 30s per question in Rapid Fire mode.
        </p>
      )}
      {value === "MISTAKE_REPLAY" && (
        <p className="text-xs text-text-secondary bg-surface-2 border border-border rounded-lg px-3 py-2">
          All filters are disabled — questions are drawn from your personal wrong answers list.
        </p>
      )}
    </div>
  )
}
