"use client"

import { useState, useMemo } from "react"
import { NoteSearchBar } from "./NoteSearchBar"
import { NoteFilterRow, type NoteFilters } from "./NoteFilterRow"
import { NoteCard } from "./NoteCard"
import type { Note } from "@/types/note"

type NoteDoc = Note & { note_id: string }

interface Props {
  notes: NoteDoc[]
  initialChapter: string | undefined
  initialSubject: string | undefined
}

export function NotesLibrary({ notes, initialChapter, initialSubject }: Props) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<NoteFilters>({
    subject:   initialSubject ?? "ALL",
    type:      "ALL",
    minRating: 0,
  })

  const filtered = useMemo(() => {
    return notes.filter((note) => {
      if (initialChapter && note.chapter_id !== initialChapter) return false
      if (filters.subject !== "ALL" && note.subject !== filters.subject) return false
      if (filters.type !== "ALL" && note.type !== filters.type) return false
      if (filters.minRating > 0 && note.aggregate_rating < filters.minRating) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          note.title.toLowerCase().includes(q) ||
          note.subject.toLowerCase().includes(q) ||
          note.creator_name.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [notes, search, filters, initialChapter])

  return (
    <div className="space-y-4">
      <NoteSearchBar value={search} onChange={setSearch} />
      <NoteFilterRow filters={filters} onChange={setFilters} />

      {initialChapter && (
        <p className="text-xs text-text-secondary">
          Showing notes for chapter: <span className="text-accent">{initialChapter}</span>
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-secondary text-sm">No notes match your filters</p>
          <button
            onClick={() => {
              setSearch("")
              setFilters({ subject: "ALL", type: "ALL", minRating: 0 })
            }}
            className="mt-3 text-xs text-accent hover:text-text-primary transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((note) => (
            <NoteCard key={note.note_id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
