"use client"

import { useState } from "react"

interface Props {
  chapterHealth: Record<string, number>
  subjectChapterMap: Record<string, { id: string; name: string }[]>
}

function healthColor(health: number): string {
  if (health >= 75) return "bg-success/70"
  if (health >= 50) return "bg-warning/70"
  if (health >= 25) return "bg-danger/50"
  return "bg-surface-2"
}

function healthLabel(health: number): string {
  if (health >= 75) return "Strong"
  if (health >= 50) return "OK"
  if (health >= 25) return "Weak"
  return "Untested"
}

export function ChapterHeatmap({ chapterHealth, subjectChapterMap }: Props) {
  const subjects = Object.keys(subjectChapterMap)
  const [activeSubject, setActiveSubject] = useState(subjects[0] ?? "")

  const chapters = subjectChapterMap[activeSubject] ?? []

  return (
    <div className="space-y-3">
      {/* Subject tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
              activeSubject === s
                ? "bg-accent text-background"
                : "bg-surface-2 border border-border text-text-secondary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[10px] text-text-secondary">
        {[
          { label: "Strong (≥75)", cls: "bg-success/70" },
          { label: "OK (50-74)", cls: "bg-warning/70" },
          { label: "Weak (25-49)", cls: "bg-danger/50" },
          { label: "Untested", cls: "bg-surface-2 border border-border" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${cls}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Chapter grid */}
      <div className="grid grid-cols-2 gap-2">
        {chapters.map(({ id, name }) => {
          const health = chapterHealth[id] ?? 0
          return (
            <div
              key={id}
              className={`${healthColor(health)} rounded-xl p-3 space-y-0.5`}
            >
              <p className="text-xs font-medium text-text-primary truncate">{name}</p>
              <p className="text-[10px] text-text-secondary">
                {health > 0 ? `${health}% · ${healthLabel(health)}` : healthLabel(health)}
              </p>
            </div>
          )
        })}
      </div>

      {chapters.length === 0 && (
        <p className="text-center text-sm text-text-secondary py-6">No chapters found</p>
      )}
    </div>
  )
}
