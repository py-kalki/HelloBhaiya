"use client"

import { lookupLevel } from "@/lib/scoring"

type Props = {
  xp: number
  size?: "sm" | "md" | "lg"
}

const SIZE_STYLES = {
  sm: { outer: "w-8 h-8 text-xs", text: "text-[10px]" },
  md: { outer: "w-11 h-11 text-sm", text: "text-xs" },
  lg: { outer: "w-16 h-16 text-lg", text: "text-sm" },
}

export function LevelBadge({ xp, size = "md" }: Props) {
  const { level, title } = lookupLevel(xp)
  const styles = SIZE_STYLES[size]

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`${styles.outer} rounded-xl bg-surface-2 border border-border flex items-center justify-center font-bold font-mono text-text-primary`}
      >
        {level}
      </div>
      {size !== "sm" && (
        <span className={`${styles.text} text-text-secondary truncate max-w-[80px] text-center`}>
          {title}
        </span>
      )}
    </div>
  )
}
