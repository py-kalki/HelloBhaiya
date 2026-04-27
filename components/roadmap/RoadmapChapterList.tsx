"use client"

import { useState, useMemo } from "react"
import { FilterBar } from "./FilterBar"
import { ChapterListItem } from "./ChapterListItem"
import type { ChapterWithProgress, FilterMode } from "@/types/syllabus"

interface Props {
  chapters: ChapterWithProgress[]
  subject: string
}

export function RoadmapChapterList({ chapters, subject }: Props) {
  const [filter, setFilter] = useState<FilterMode>("ALL")

  const filtered = useMemo(() => {
    const subjectFiltered =
      subject === "All" ? chapters : chapters.filter((c) => c.subject === subject)

    if (filter === "ALL") return subjectFiltered
    if (filter === "DANGER_ZONE")    return subjectFiltered.filter((c) => c.status === "DANGER_ZONE")
    if (filter === "NEEDS_REVISION") return subjectFiltered.filter((c) => c.needsRevision)
    if (filter === "NOT_STARTED")    return subjectFiltered.filter((c) => c.status === "NOT_STARTED")
    return subjectFiltered
  }, [chapters, subject, filter])

  const base = subject === "All" ? chapters : chapters.filter((c) => c.subject === subject)

  const counts: Record<FilterMode, number> = {
    ALL:            base.length,
    DANGER_ZONE:    base.filter((c) => c.status === "DANGER_ZONE").length,
    NEEDS_REVISION: base.filter((c) => c.needsRevision).length,
    NOT_STARTED:    base.filter((c) => c.status === "NOT_STARTED").length,
  }

  const displaySubject = subject === "All" ? "All" : subject

  return (
    <div className="space-y-3">
      <FilterBar active={filter} onChange={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-text-secondary text-sm">No chapters match this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((chapter) => (
            <ChapterListItem
              key={chapter.chapter_id}
              chapter={chapter}
              subject={displaySubject === "All" ? chapter.subject : displaySubject}
            />
          ))}
        </div>
      )}
    </div>
  )
}
