"use client"

type DifficultyConfig = { easy: number; medium: number; hard: number }

type Props = {
  value: DifficultyConfig
  onChange: (value: DifficultyConfig) => void
  disabled?: boolean
}

const LEVELS = ["easy", "medium", "hard"] as const
const COLORS = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-danger",
}
const LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" }

export function DifficultySliders({ value, onChange, disabled }: Props) {
  function handleChange(key: keyof DifficultyConfig, raw: number) {
    const newVal = Math.max(0, Math.min(100, raw))
    const others = LEVELS.filter((k) => k !== key)
    const remaining = 100 - newVal
    const otherSum = others.reduce((s, k) => s + value[k], 0)

    const updated: DifficultyConfig = { ...value, [key]: newVal }

    if (otherSum === 0) {
      // distribute equally
      const split = Math.floor(remaining / 2)
      updated[others[0]!] = split
      updated[others[1]!] = remaining - split
    } else {
      // proportionally adjust the other two
      let distributed = 0
      for (let i = 0; i < others.length - 1; i++) {
        const k = others[i]!
        const share = Math.round((value[k] / otherSum) * remaining)
        updated[k] = share
        distributed += share
      }
      updated[others[others.length - 1]!] = remaining - distributed
    }

    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      {LEVELS.map((key) => (
        <div key={key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">{LABELS[key]}</span>
            <span className="text-text-primary font-mono font-semibold">{value[key]}%</span>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={100}
              value={value[key]}
              disabled={disabled}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, var(--color-${key === "easy" ? "success" : key === "medium" ? "warning" : "danger"}) 0%, var(--color-${key === "easy" ? "success" : key === "medium" ? "warning" : "danger"}) ${value[key]}%, #272729 ${value[key]}%, #272729 100%)`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Visual breakdown bar */}
      <div className="flex rounded-full overflow-hidden h-2 gap-px">
        {value.easy > 0 && (
          <div
            className={`${COLORS.easy} transition-all`}
            style={{ width: `${value.easy}%` }}
          />
        )}
        {value.medium > 0 && (
          <div
            className={`${COLORS.medium} transition-all`}
            style={{ width: `${value.medium}%` }}
          />
        )}
        {value.hard > 0 && (
          <div
            className={`${COLORS.hard} transition-all`}
            style={{ width: `${value.hard}%` }}
          />
        )}
      </div>
    </div>
  )
}
