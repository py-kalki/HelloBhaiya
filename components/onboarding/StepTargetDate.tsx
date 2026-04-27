"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"

// Next known NEET date: May 4, 2027
const NEET_DEFAULT = "2027-05-04"
const TODAY = format(addDays(new Date(), 1), "yyyy-MM-dd")

type Props = {
  value: string
  onChange: (date: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepTargetDate({ value, onChange, onNext, onBack }: Props) {
  const [touched, setTouched] = useState(false)
  const isValid = value && value > format(new Date(), "yyyy-MM-dd")

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary">When is your exam?</h2>
        <p className="text-text-secondary text-sm mt-1">
          We&apos;ll calculate your countdown and study pace.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-text-secondary font-medium">
          Target exam date
        </label>
        <input
          type="date"
          value={value || NEET_DEFAULT}
          min={TODAY}
          onChange={(e) => {
            setTouched(true)
            onChange(e.target.value)
          }}
          className={[
            "w-full h-12 rounded-xl border px-4 bg-surface text-text-primary",
            "focus:outline-none focus:border-accent transition-colors",
            "text-sm [color-scheme:dark]",
            touched && !isValid ? "border-danger" : "border-border",
          ].join(" ")}
        />
        {touched && !isValid && (
          <p className="text-danger text-xs">Please choose a future date.</p>
        )}
        <p className="text-text-secondary text-xs">
          NEET 2027 is on{" "}
          <button
            type="button"
            onClick={() => onChange(NEET_DEFAULT)}
            className="text-accent underline underline-offset-2"
          >
            May 4, 2027
          </button>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface-2 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            setTouched(true)
            if (isValid) onNext()
          }}
          className="flex-1 h-12 rounded-xl bg-accent text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
