"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react"
import type { SubjectData } from "@/lib/syllabusData"

type Props = {
  syllabus: SubjectData[]
  selectedSubjects: string[]
  selectedChapters: string[]
  onSubjectToggle: (subject: string) => void
  onChapterToggle: (chapterId: string) => void
  onSelectAllChapters: (subjectName: string, chapterIds: string[]) => void
}

export function SubjectChapterSelector({
  syllabus,
  selectedSubjects,
  selectedChapters,
  onSubjectToggle,
  onChapterToggle,
  onSelectAllChapters,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([])

  function toggleExpand(subjectName: string) {
    setExpanded((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName],
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {syllabus.map((subject) => {
        const isSubjectSelected = selectedSubjects.includes(subject.name)
        const isExpanded = expanded.includes(subject.name)
        const chapterIds = subject.chapters.map((c) => c.id)
        const selectedCount = chapterIds.filter((id) => selectedChapters.includes(id)).length
        const allSelected = selectedCount === chapterIds.length

        return (
          <div
            key={subject.name}
            className="rounded-xl border border-border overflow-hidden"
          >
            {/* Subject header row */}
            <div className="flex items-center gap-3 p-3 bg-surface">
              <button
                type="button"
                onClick={() => onSubjectToggle(subject.name)}
                className="flex items-center gap-2 flex-1 min-h-[44px] text-left"
              >
                <span
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isSubjectSelected
                      ? "bg-accent border-accent"
                      : "border-border"
                  }`}
                >
                  {isSubjectSelected && (
                    <span className="w-2 h-2 rounded-sm bg-background" />
                  )}
                </span>
                <span className="font-semibold text-text-primary text-sm">{subject.name}</span>
                {selectedCount > 0 && (
                  <span className="ml-auto text-xs text-text-secondary">
                    {selectedCount}/{chapterIds.length} chapters
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleExpand(subject.name)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Chapter list */}
            {isExpanded && (
              <div className="border-t border-border bg-surface-2 p-3 flex flex-col gap-1">
                {/* Select all */}
                <button
                  type="button"
                  onClick={() => onSelectAllChapters(subject.name, chapterIds)}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
                >
                  {allSelected ? (
                    <CheckSquare size={14} className="text-accent" />
                  ) : (
                    <Square size={14} />
                  )}
                  Select all {subject.name} chapters
                </button>

                {subject.chapters.map((chapter) => {
                  const isSelected = selectedChapters.includes(chapter.id)
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => onChapterToggle(chapter.id)}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-left transition-colors min-h-[44px] hover:bg-surface"
                    >
                      <span
                        className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-accent border-accent" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-sm bg-background" />
                        )}
                      </span>
                      <span className={isSelected ? "text-text-primary" : "text-text-secondary"}>
                        {chapter.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
