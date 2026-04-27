"use client"

import type { Exam } from "@/types/student"

type ExamOption = {
  value: Exam
  label: string
  icon: string
  description: string
}

const EXAM_OPTIONS: ExamOption[] = [
  { value: "NEET",     label: "NEET",      icon: "🧬", description: "Medical entrance" },
  { value: "JEE_MAINS",label: "JEE Mains", icon: "⚛️", description: "Engineering entrance" },
  { value: "JEE_ADV",  label: "JEE Advanced",icon: "🔬",description: "IIT entrance" },
  { value: "OTHER",    label: "Other",     icon: "📖", description: "State / other exam" },
]

type Props = {
  selected: Exam | null
  onSelect: (exam: Exam) => void
  onNext: () => void
}

export function StepExamSelector({ selected, onSelect, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary">Which exam are you preparing for?</h2>
        <p className="text-text-secondary text-sm mt-1">We&apos;ll personalise your experience.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EXAM_OPTIONS.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={[
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all min-h-[100px] cursor-pointer",
                isSelected
                  ? "border-accent bg-surface-2 text-text-primary"
                  : "border-border bg-surface text-text-secondary hover:border-accent/50 hover:bg-surface-2",
              ].join(" ")}
            >
              <span className="text-3xl">{option.icon}</span>
              <div className="text-center">
                <p className={`font-semibold text-sm ${isSelected ? "text-text-primary" : ""}`}>
                  {option.label}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full h-12 rounded-xl bg-accent text-background font-semibold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
      >
        Next →
      </button>
    </div>
  )
}
