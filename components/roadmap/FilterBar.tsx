"use client"

import type { FilterMode } from "@/types/syllabus"

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: "ALL",            label: "All" },
  { id: "DANGER_ZONE",    label: "Danger Zone" },
  { id: "NEEDS_REVISION", label: "Needs Revision" },
  { id: "NOT_STARTED",    label: "Not Started" },
]

interface Props {
  active: FilterMode
  onChange: (f: FilterMode) => void
  counts: Record<FilterMode, number>
}

export function FilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map(({ id, label }) => {
        const isActive = active === id
        const count = counts[id] ?? 0

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
              isActive
                ? "bg-accent text-background"
                : "bg-surface-2 text-text-secondary border border-border hover:text-text-primary"
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 ${
                  isActive ? "bg-background/20" : "bg-surface text-text-secondary"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
