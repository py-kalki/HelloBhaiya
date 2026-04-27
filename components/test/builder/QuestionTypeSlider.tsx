"use client"

type Props = {
  numericalPct: number
  onChange: (pct: number) => void
  disabled?: boolean
}

export function QuestionTypeSlider({ numericalPct, onChange, disabled }: Props) {
  const theoryPct = 100 - numericalPct

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">Theoretical</span>
        <span className="text-text-primary font-mono font-semibold">
          {theoryPct}% / {numericalPct}% Numerical
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={numericalPct}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #888888 0%, #888888 ${theoryPct}%, var(--color-accent) ${theoryPct}%, var(--color-accent) 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>All MCQ</span>
        <span>All Numerical</span>
      </div>
    </div>
  )
}
