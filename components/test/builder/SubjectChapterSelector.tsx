"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CheckSquare, Square, FileText } from "lucide-react"
import type { SubjectData } from "@/lib/syllabusData"

type Props = {
  syllabus: SubjectData[]
  selectedSubjects: string[]
  selectedChapters: string[]
  selectedTopics: string[]
  onSubjectToggle: (subject: string) => void
  onChapterToggle: (chapterId: string) => void
  onTopicToggle: (topic: string) => void
  onSelectAllChapters: (subjectName: string, chapterIds: string[]) => void
}

export function SubjectChapterSelector({
  syllabus,
  selectedSubjects,
  selectedChapters,
  selectedTopics,
  onSubjectToggle,
  onChapterToggle,
  onTopicToggle,
  onSelectAllChapters,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([])
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  function toggleExpand(subjectName: string) {
    setExpanded((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName],
    )
  }

  function toggleChapterExpand(chapterId: string, e: React.MouseEvent) {
    e.stopPropagation()
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((c) => c !== chapterId)
        : [...prev, chapterId],
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
                  const isChapterExpanded = expandedChapters.includes(chapter.id)
                  
                  // If chapter is selected, all its topics are effectively selected visually
                  // If not, we check if specific topics are selected
                  const selectedTopicCount = chapter.topics 
                    ? chapter.topics.filter(t => selectedTopics.includes(t)).length
                    : 0;
                  
                  const hasTopics = chapter.topics && chapter.topics.length > 0;

                  return (
                    <div key={chapter.id} className="flex flex-col">
                      <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-left transition-colors min-h-[44px] hover:bg-surface group">
                        <button
                          type="button"
                          onClick={() => onChapterToggle(chapter.id)}
                          className="flex items-center gap-2 flex-1 h-full"
                        >
                          <span
                            className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                              isSelected || (selectedTopicCount > 0 && selectedTopicCount === chapter.topics?.length)
                                ? "bg-accent border-accent" 
                                : selectedTopicCount > 0 
                                  ? "border-accent bg-accent/20"
                                  : "border-border"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-sm bg-background" />
                            )}
                            {!isSelected && selectedTopicCount > 0 && (
                              <span className="w-1.5 h-1.5 rounded-sm bg-accent" />
                            )}
                          </span>
                          <span className={isSelected || selectedTopicCount > 0 ? "text-text-primary" : "text-text-secondary"}>
                            {chapter.name}
                          </span>
                        </button>
                        
                        {hasTopics && (
                          <button
                            type="button"
                            onClick={(e) => toggleChapterExpand(chapter.id, e)}
                            className="min-w-[32px] min-h-[32px] flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface rounded-md transition-colors"
                          >
                            {isChapterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>

                      {/* Topics List */}
                      {isChapterExpanded && hasTopics && (
                        <div className="pl-8 pr-2 py-1 flex flex-col gap-1 border-l border-border/50 ml-4 mb-2">
                          {chapter.topics!.map(topic => {
                            // if the whole chapter is selected, topic is disabled visually selected
                            const isTopicSelected = isSelected || selectedTopics.includes(topic)
                            
                            return (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => {
                                  // idk why this would break on mobile, but keeping it simple
                                  if (isSelected) {
                                    // if chapter was fully selected, unselect it and select all OTHER topics
                                    onChapterToggle(chapter.id);
                                    chapter.topics!.forEach(t => {
                                      if (t !== topic && !selectedTopics.includes(t)) {
                                        onTopicToggle(t);
                                      }
                                    });
                                  } else {
                                    onTopicToggle(topic);
                                  }
                                }}
                                className="flex items-start gap-2 py-1.5 px-2 rounded-md text-xs text-left transition-colors hover:bg-surface/50"
                              >
                                <span
                                  className={`w-3.5 h-3.5 mt-0.5 rounded-sm border shrink-0 flex items-center justify-center transition-colors ${
                                    isTopicSelected ? "bg-accent border-accent" : "border-border"
                                  }`}
                                >
                                  {isTopicSelected && (
                                    <span className="w-1 h-1 rounded-sm bg-background" />
                                  )}
                                </span>
                                <span className={isTopicSelected ? "text-text-secondary" : "text-text-tertiary"}>
                                  {topic}
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
            )}
          </div>
        )
      })}
    </div>
  )
}
