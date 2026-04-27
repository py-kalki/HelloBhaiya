"use client"

import Link from "next/link"
import { CheckCircle2, XCircle, Minus, BookOpen, Zap } from "lucide-react"
import type { Question } from "@/types/question"

type Props = {
  question: Question
  index: number
  studentAnswer: string | number | undefined
  isCorrect: boolean
  isUnattempted: boolean
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const

function formatMath(text: string): string {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, "<span>\\[$1\\]</span>")
    .replace(/\$([\s\S]+?)\$/g, "<span>\\($1\\)</span>")
}

export function QuestionReviewCard({
  question,
  index,
  studentAnswer,
  isCorrect,
  isUnattempted,
}: Props) {
  const borderColor = isUnattempted
    ? "border-border"
    : isCorrect
      ? "border-success/30"
      : "border-danger/30"

  const statusIcon = isUnattempted ? (
    <Minus size={16} className="text-text-secondary" />
  ) : isCorrect ? (
    <CheckCircle2 size={16} className="text-success" />
  ) : (
    <XCircle size={16} className="text-danger" />
  )

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-xl border bg-surface ${borderColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className="text-xs text-text-secondary font-mono">Q{index + 1}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              question.difficulty === "EASY"
                ? "text-success border-success/30"
                : question.difficulty === "MEDIUM"
                  ? "text-warning border-warning/30"
                  : "text-danger border-danger/30"
            }`}
          >
            {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
          </span>
        </div>
        <span className="text-xs text-text-secondary shrink-0">
          {question.subject} · {question.chapter}
        </span>
      </div>

      {/* Question text */}
      <div
        className="text-text-primary text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatMath(question.question_text) }}
      />

      {/* Options — for MCQ */}
      {question.type !== "NUMERICAL" && (
        <div className="flex flex-col gap-2">
          {question.options.map((option, i) => {
            const label = OPTION_LABELS[i]!
            const isCorrectOption = String(question.correct_answer) === label
            const isStudentOption = String(studentAnswer) === label

            let optionStyle = "border-border text-text-secondary"
            if (isCorrectOption) optionStyle = "border-success/40 bg-success/8 text-success"
            else if (isStudentOption && !isCorrectOption)
              optionStyle = "border-danger/40 bg-danger/8 text-danger"

            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${optionStyle}`}
              >
                <span className="font-mono font-bold shrink-0 w-5">{label}</span>
                <span
                  className="flex-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMath(option) }}
                />
                {isCorrectOption && <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />}
                {isStudentOption && !isCorrectOption && (
                  <XCircle size={14} className="text-danger shrink-0 mt-0.5" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Numerical answer */}
      {question.type === "NUMERICAL" && (
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-text-secondary mb-1">Your answer</p>
            <p
              className={`font-mono font-bold ${
                isUnattempted ? "text-text-secondary" : isCorrect ? "text-success" : "text-danger"
              }`}
            >
              {isUnattempted ? "—" : String(studentAnswer)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Correct answer</p>
            <p className="font-mono font-bold text-success">{String(question.correct_answer)}</p>
          </div>
        </div>
      )}

      {/* Explanation */}
      {question.explanation && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-text-secondary mb-1 font-semibold">Explanation</p>
          <div
            className="text-text-secondary text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMath(question.explanation) }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href={`/notes?chapter=${question.chapter_id}`}
          className="flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-lg px-3 py-2 hover:border-text-secondary transition-colors min-h-[44px]"
        >
          <BookOpen size={12} />
          Fix This — Go to Notes
        </Link>
        <Link
          href={`/test/build?chapter=${question.chapter_id}&count=5`}
          className="flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-lg px-3 py-2 hover:border-text-secondary transition-colors min-h-[44px]"
        >
          <Zap size={12} />
          Drill This Topic
        </Link>
      </div>
    </div>
  )
}
