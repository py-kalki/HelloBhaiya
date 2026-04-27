"use client"

import type { Exam } from "@/types/student"

const SUBJECTS_BY_EXAM: Record<Exam, string[]> = {
  NEET:      ["Physics", "Chemistry", "Biology"],
  JEE_MAINS: ["Physics", "Chemistry", "Mathematics"],
  JEE_ADV:   ["Physics", "Chemistry", "Mathematics"],
  OTHER:     ["Physics", "Chemistry", "Biology", "Mathematics"],
}

type Props = {
  exam: Exam
  selected: string[]
  onToggle: (subject: string) => void
  onFinish: () => void
  onBack: () => void
  loading: boolean
}

export function StepWeakSubjects({
  exam,
  selected,
  onToggle,
  onFinish,
  onBack,
  loading,
}: Props) {
  const subjects = SUBJECTS_BY_EXAM[exam]

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary">
          Which subjects feel weakest?
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          We&apos;ll prioritise these in your daily goals. You can skip.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {subjects.map((subject) => {
          const isSelected = selected.includes(subject)
          return (
            <button
              key={subject}
              onClick={() => onToggle(subject)}
              className={[
                "px-5 py-3 rounded-full border text-sm font-medium transition-all min-h-[44px]",
                isSelected
                  ? "border-danger bg-danger/10 text-danger"
                  : "border-border bg-surface text-text-secondary hover:border-accent/50 hover:text-text-primary",
              ].join(" ")}
            >
              {subject}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-center text-text-secondary text-xs">
          {selected.length} subject{selected.length > 1 ? "s" : ""} selected as weak
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 h-12 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface-2 transition-colors disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={onFinish}
          disabled={loading}
          className="flex-1 h-12 rounded-xl bg-accent text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Setting up…" : selected.length > 0 ? "Finish →" : "Skip →"}
        </button>
      </div>
    </div>
  )
}
