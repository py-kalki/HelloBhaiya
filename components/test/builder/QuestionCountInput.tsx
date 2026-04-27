"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import type { TestConfig } from "@/types/question"

type Props = {
  value: number
  onChange: (n: number) => void
  config: TestConfig
  disabled?: boolean
}

export function QuestionCountInput({ value, onChange, config, disabled }: Props) {
  const [available, setAvailable] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (config.mode === "MISTAKE_REPLAY") return
    const t = setTimeout(() => {
      setLoading(true)
      fetch("/api/questions/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: config.subjects,
          chapters: config.chapters,
          mode: config.mode,
          pyq_year_range: config.pyq_year_range,
        }),
      })
        .then((res) => (res.ok ? (res.json() as Promise<{ count: number }>) : null))
        .then((data) => {
          if (data) setAvailable(data.count)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 400)
    return () => clearTimeout(t)
  }, [config.subjects, config.chapters, config.mode, config.pyq_year_range])

  const isOverLimit = available !== null && value > available
  const clampedHint = isOverLimit ? `Only ${available} available` : null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={10}
          max={200}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const n = Math.max(10, Math.min(200, Number(e.target.value)))
            onChange(n)
          }}
          className="w-24 bg-surface-2 border border-border rounded-lg px-3 py-2 text-text-primary text-sm font-mono text-center focus:outline-none focus:border-accent disabled:opacity-40"
        />
        <div className="text-xs text-text-secondary">
          {loading ? (
            <span className="opacity-60">Checking...</span>
          ) : available !== null ? (
            <span className={isOverLimit ? "text-warning" : "text-success"}>
              {available.toLocaleString()} questions match
            </span>
          ) : null}
        </div>
      </div>

      {clampedHint && (
        <div className="flex items-center gap-1.5 text-xs text-warning">
          <AlertTriangle size={12} />
          <span>{clampedHint} — test will use max available</span>
        </div>
      )}

      {/* Quick presets */}
      <div className="flex gap-2 flex-wrap">
        {[10, 20, 45, 90, 180].map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={`px-3 py-1 rounded-lg text-xs border transition-colors min-h-[44px] min-w-[44px] ${
              value === n
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-text-secondary hover:border-text-secondary"
            } disabled:opacity-40`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
