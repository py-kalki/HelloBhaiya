"use client"

import { Flame } from "lucide-react"

type Props = {
  streak: number
  size?: "sm" | "md"
}

export function StreakDisplay({ streak, size = "md" }: Props) {
  const isActive = streak > 0

  return (
    <div className="flex items-center gap-1.5">
      <Flame
        size={size === "sm" ? 14 : 18}
        className={`transition-colors ${isActive ? "text-warning animate-pulse" : "text-text-secondary"}`}
      />
      <span
        className={`font-bold font-mono ${
          size === "sm" ? "text-sm" : "text-base"
        } ${isActive ? "text-warning" : "text-text-secondary"}`}
      >
        {streak}
      </span>
      {size === "md" && (
        <span className="text-xs text-text-secondary">
          {streak === 1 ? "day" : "days"}
        </span>
      )}
    </div>
  )
}
