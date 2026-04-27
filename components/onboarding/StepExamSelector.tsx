"use client"

import type { Exam } from "@/types/student"

type ExamOption = {
  value: Exam
  label: string
  icon: string
  description: string
  gradient: string
  border: string
}

const EXAM_OPTIONS: ExamOption[] = [
  { value: "NEET",      label: "NEET",         icon: "🧬", description: "Medical entrance",    gradient: "from-emerald-500/12 to-emerald-500/3", border: "border-emerald-500/20" },
  { value: "JEE_MAINS", label: "JEE Mains",   icon: "⚛️", description: "Engineering entrance", gradient: "from-blue-500/12 to-blue-500/3",    border: "border-blue-500/20"    },
  { value: "JEE_ADV",   label: "JEE Advanced", icon: "🔬", description: "IIT entrance",         gradient: "from-violet-500/12 to-violet-500/3", border: "border-violet-500/20"  },
  { value: "OTHER",     label: "Other",         icon: "📖", description: "State / other exam",  gradient: "from-amber-500/12 to-amber-500/3",  border: "border-amber-500/20"   },
]

type Props = { selected: Exam | null; onSelect: (exam: Exam) => void; onNext: () => void }

export function StepExamSelector({ selected, onSelect, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="text-3xl mb-3">🎓</div>
        <h2 className="text-xl font-bold text-text-primary">Which exam are you preparing for?</h2>
        <p className="text-text-muted text-sm mt-1">We&apos;ll personalise every experience.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EXAM_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 min-h-[110px] cursor-pointer overflow-hidden
                ${isSelected
                  ? `bg-gradient-to-br ${opt.gradient} ${opt.border} shadow-lg`
                  : "bg-surface-2/50 border-border hover:border-text-muted"
                }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <span className="text-3xl">{opt.icon}</span>
              <div className="text-center">
                <p className={`font-bold text-sm ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">{opt.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full h-12 rounded-xl bg-accent text-background font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[.98] shadow-lg shadow-accent/20"
      >
        Next →
      </button>
    </div>
  )
}
