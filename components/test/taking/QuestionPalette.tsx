"use client"

import { Flag, X } from "lucide-react"
import type { Question } from "@/types/question"

type Props = {
  questions: Question[]
  answers: Record<string, string | number>
  flagged: string[]
  currentIndex: number
  onNavigate: (index: number) => void
  onClose: () => void
  answeredCount: number
  totalCount: number
}

type QuestionStatus = "current" | "answered" | "flagged" | "unattempted"

function getStatus(
  q: Question,
  index: number,
  currentIndex: number,
  answers: Record<string, string | number>,
  flagged: string[],
): QuestionStatus {
  if (index === currentIndex) return "current"
  if (flagged.includes(q.question_id)) return "flagged"
  if (q.question_id in answers) return "answered"
  return "unattempted"
}

const STATUS_STYLES: Record<QuestionStatus, string> = {
  current:     "bg-accent text-background border-accent",
  answered:    "bg-success/20 text-success border-success/40",
  flagged:     "bg-warning/20 text-warning border-warning/40",
  unattempted: "bg-surface text-text-secondary border-border",
}

export function QuestionPalette({
  questions,
  answers,
  flagged,
  currentIndex,
  onNavigate,
  onClose,
  answeredCount,
  totalCount,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div>
          <h2 className="text-text-primary font-semibold text-sm">Question Palette</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {answeredCount}/{totalCount} answered
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap px-4 py-3 border-b border-border text-xs shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent" /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-success/30" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <Flag size={10} className="text-warning" /> Flagged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-border" /> Unattempted
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, i) => {
            const status = getStatus(q, i, currentIndex, answers, flagged)
            return (
              <button
                key={q.question_id}
                type="button"
                onClick={() => { onNavigate(i); onClose() }}
                className={`relative aspect-square flex items-center justify-center rounded-lg border text-xs font-mono font-bold transition-colors min-h-[44px] min-w-[44px] ${STATUS_STYLES[status]}`}
              >
                {i + 1}
                {status === "flagged" && (
                  <Flag size={8} className="absolute top-1 right-1 text-warning" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
