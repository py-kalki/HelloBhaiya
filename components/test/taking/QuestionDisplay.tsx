"use client"

import Image from "next/image"
import type { Question } from "@/types/question"
import { Flag, FlagOff } from "lucide-react"

type Props = {
  question: Question
  index: number
  total: number
  isFlagged: boolean
  onToggleFlag: () => void
}

export function QuestionDisplay({ question, index, total, isFlagged, onToggleFlag }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header: question number + flag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-secondary">
            Q{index + 1}
          </span>
          <span className="text-xs text-text-secondary">/ {total}</span>
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${
              question.difficulty === "EASY"
                ? "text-success border-success/30 bg-success/10"
                : question.difficulty === "MEDIUM"
                  ? "text-warning border-warning/30 bg-warning/10"
                  : "text-danger border-danger/30 bg-danger/10"
            }`}
          >
            {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
          </span>
          {question.is_pyq && question.pyq_year && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-accent/30 text-accent bg-accent/10">
              PYQ {question.pyq_year}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleFlag}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors hover:bg-surface-2"
          aria-label={isFlagged ? "Unflag question" : "Flag for review"}
        >
          {isFlagged ? (
            <Flag size={18} className="text-warning" />
          ) : (
            <FlagOff size={18} className="text-text-secondary" />
          )}
        </button>
      </div>

      {/* Chapter + topic breadcrumb */}
      <p className="text-xs text-text-secondary">
        {question.subject} · {question.chapter}
      </p>

      {/* Question text — MathJax rendered by surrounding MathJaxContext */}
      <div
        className="text-text-primary text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatMath(question.question_text) }}
      />

      {/* Optional image */}
      {question.image_url && (
        <div className="relative w-full max-h-64 rounded-xl overflow-hidden border border-border">
          <Image
            src={question.image_url}
            alt="Question diagram"
            width={600}
            height={256}
            className="object-contain w-full"
          />
        </div>
      )}

      {/* Assertion-Reason hint */}
      {question.type === "ASSERTION_REASON" && (
        <div className="text-xs text-text-secondary bg-surface-2 rounded-lg px-3 py-2 border border-border">
          A: Assertion is true, R is true, R is correct explanation of A
          <br />
          B: Assertion is true, R is true, R is NOT correct explanation
          <br />
          C: Assertion is true, R is false
          <br />
          D: Assertion is false, R is true
        </div>
      )}
    </div>
  )
}

// Wraps $$...$$ and \(...\) in spans for MathJax to pick up
function formatMath(text: string): string {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, "<span class='math-block'>\\[$1\\]</span>")
    .replace(/\$([\s\S]+?)\$/g, "<span class='math-inline'>\\($1\\)</span>")
}
