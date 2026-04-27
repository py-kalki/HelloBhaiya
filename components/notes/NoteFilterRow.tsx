"use client"

import type { NoteType } from "@/types/note"

export type NoteFilters = {
  subject: string
  type: NoteType | "ALL"
  minRating: number
}

const SUBJECTS = ["ALL", "Biology", "Physics", "Chemistry"] as const
const TYPES: { id: NoteType | "ALL"; label: string }[] = [
  { id: "ALL",         label: "All Types" },
  { id: "TYPED",       label: "Typed" },
  { id: "HANDWRITTEN", label: "Handwritten" },
]
const RATINGS = [
  { min: 0,   label: "Any" },
  { min: 4,   label: "4+ ★" },
  { min: 4.5, label: "4.5+ ★" },
]

interface Props {
  filters: NoteFilters
  onChange: (f: NoteFilters) => void
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
        active
          ? "bg-accent text-background"
          : "bg-surface-2 text-text-secondary border border-border hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  )
}

export function NoteFilterRow({ filters, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUBJECTS.map((s) => (
          <Chip
            key={s}
            active={filters.subject === s}
            onClick={() => onChange({ ...filters, subject: s })}
          >
            {s === "ALL" ? "All Subjects" : s}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TYPES.map(({ id, label }) => (
          <Chip
            key={id}
            active={filters.type === id}
            onClick={() => onChange({ ...filters, type: id })}
          >
            {label}
          </Chip>
        ))}
        <span className="w-px bg-border shrink-0 mx-1" />
        {RATINGS.map(({ min, label }) => (
          <Chip
            key={min}
            active={filters.minRating === min}
            onClick={() => onChange({ ...filters, minRating: min })}
          >
            {label}
          </Chip>
        ))}
      </div>
    </div>
  )
}
