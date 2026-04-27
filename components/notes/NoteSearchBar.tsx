"use client"

import { Search, X } from "lucide-react"

interface Props {
  value: string
  onChange: (v: string) => void
}

export function NoteSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search notes by title, chapter…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-2 border border-border rounded-xl pl-9 pr-10 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors min-h-[44px]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
