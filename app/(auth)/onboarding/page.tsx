"use client"

import { useState } from "react"
import { StepExamSelector } from "@/components/onboarding/StepExamSelector"
import { StepTargetDate } from "@/components/onboarding/StepTargetDate"
import { StepWeakSubjects } from "@/components/onboarding/StepWeakSubjects"
import { CompletionAnimation } from "@/components/onboarding/CompletionAnimation"
import { createUserProfile } from "@/actions/createUserProfile"
import type { Exam } from "@/types/student"

type Step = 1 | 2 | 3 | "done"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1)
  const [exam, setExam] = useState<Exam | null>(null)
  const [targetDate, setTargetDate] = useState("2027-05-04")
  const [weakSubjects, setWeakSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleSubject(subject: string) {
    setWeakSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
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
    <div className="w-full max-w-sm flex flex-col gap-6">
      {/* Header + progress */}
      {stepNumber && (
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <p className="text-text-secondary text-xs font-medium tracking-widest uppercase">
              Step {stepNumber} of 3
            </p>
          </div>
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((n) => (
              <div
                key={n}
                className={[
                  "flex-1 h-1 rounded-full transition-colors",
                  n <= stepNumber ? "bg-accent" : "bg-surface-2",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="bg-surface border border-border rounded-xl p-6">
        {step === 1 && (
          <StepExamSelector
            selected={exam}
            onSelect={setExam}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTargetDate
            value={targetDate}
            onChange={setTargetDate}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && exam && (
          <StepWeakSubjects
            exam={exam}
            selected={weakSubjects}
            onToggle={toggleSubject}
            onFinish={handleFinish}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}

        {step === "done" && <CompletionAnimation />}
      </div>

      {error && (
        <p className="text-center text-danger text-sm">{error}</p>
      )}
    </div>
  )
}
