"use client"

import type { Question } from "@/types/question"

type Props = {
  question: Question
  answer: string | number | undefined
  onAnswer: (answer: string | number) => void
  disabled?: boolean
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const

export function OptionsList({ question, answer, onAnswer, disabled }: Props) {
  if (question.type === "NUMERICAL") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs text-text-secondary">Enter your answer</label>
        <input
          type="number"
          step="any"
          placeholder="Type numerical answer..."
          value={answer !== undefined ? String(answer) : ""}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value
            if (val === "" || val === "-") return
            const n = parseFloat(val)
            if (!isNaN(n)) onAnswer(n)
          }}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary font-mono text-lg focus:outline-none focus:border-accent disabled:opacity-50"
        />
        {answer !== undefined && (
          <p className="text-xs text-success">Answer recorded: {answer}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, i) => {
        const label = OPTION_LABELS[i]!
        const isSelected = question.type === "MCQ_MULTI"
          ? Array.isArray(answer) && (answer as string[]).includes(label)
          : answer === label

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (question.type === "MCQ_MULTI") {
                const current = Array.isArray(answer) ? (answer as string[]) : []
                const updated = current.includes(label)
                  ? current.filter((x) => x !== label)
                  : [...current, label]
                onAnswer(updated.join(","))
              } else {
                onAnswer(label)
              }
            }}
            className={`flex items-start gap-3 w-full p-4 rounded-xl border text-left transition-colors min-h-[44px] ${
              isSelected
                ? "border-accent bg-accent/10 text-text-primary"
                : "border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-text-primary"
            } disabled:opacity-50`}
          >
            {/* Option label circle */}
            <span
              className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                isSelected
                  ? "bg-accent border-accent text-background"
                  : "border-border text-text-secondary"
              }`}
            >
              {label}
            </span>
            {/* Option text */}
            <span
              className="text-sm leading-relaxed pt-0.5"
              dangerouslySetInnerHTML={{ __html: formatMath(option) }}
            />
          </button>
        )
      })}
    </div>
  )
}

function formatMath(text: string): string {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, "<span class='math-block'>\\[$1\\]</span>")
    .replace(/\$([\s\S]+?)\$/g, "<span class='math-inline'>\\($1\\)</span>")
}
