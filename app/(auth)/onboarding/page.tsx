"use client"

import { useState } from "react"
import { StepExamSelector } from "@/components/onboarding/StepExamSelector"
import { StepTargetDate } from "@/components/onboarding/StepTargetDate"
import { StepWeakSubjects } from "@/components/onboarding/StepWeakSubjects"
import { CompletionAnimation } from "@/components/onboarding/CompletionAnimation"
import { createUserProfile } from "@/actions/createUserProfile"
import type { Exam } from "@/types/student"

type Step = 1 | 2 | 3 | "done"

const STEP_LABELS = ["Exam", "Target Date", "Weak Areas"]

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1)
  const [exam, setExam] = useState<Exam | null>(null)
  const [targetDate, setTargetDate] = useState("2027-05-04")
  const [weakSubjects, setWeakSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleSubject(subject: string) {
    setWeakSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    )
  }

  async function handleFinish() {
    if (!exam) return
    setLoading(true)
    setError(null)
    try {
      await createUserProfile({ exam, targetDate, weakSubjects })
      setStep("done")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const stepNumber = step === "done" ? null : step

  return (
    <div className="w-full max-w-sm flex flex-col gap-5 animate-slide-up">
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="text-xl">📚</span>
          <span className="font-bold text-text-primary tracking-tight">HelloBhaiya</span>
        </div>
      </div>

      {/* Step progress */}
      {stepNumber && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const done = n < stepNumber
              const active = n === stepNumber
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                      done   ? "bg-accent border-accent text-background"
                      : active ? "bg-accent/15 border-accent text-accent"
                      :          "bg-surface-2 border-border text-text-muted"
                    }`}>
                      {done ? "✓" : n}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${active ? "text-text-primary" : "text-text-muted"}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 transition-colors ${done ? "bg-accent/40" : "bg-border"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xl shadow-black/40">
        {step === 1 && (
          <StepExamSelector selected={exam} onSelect={setExam} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepTargetDate value={targetDate} onChange={setTargetDate} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && exam && (
          <StepWeakSubjects exam={exam} selected={weakSubjects} onToggle={toggleSubject} onFinish={handleFinish} onBack={() => setStep(2)} loading={loading} />
        )}
        {step === "done" && <CompletionAnimation />}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/8 border border-danger/20 text-danger text-xs">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}
