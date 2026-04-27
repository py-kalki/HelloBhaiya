"use client"

import { lookupLevel } from "@/lib/scoring"

type Props = { xp: number; size?: "sm" | "md" | "lg" }

const SIZE = {
  sm: { outer: "w-8 h-8",   num: "text-xs",  label: "text-[9px]"  },
  md: { outer: "w-11 h-11", num: "text-sm",  label: "text-[10px]" },
  lg: { outer: "w-16 h-16", num: "text-xl",  label: "text-xs"     },
}

export function LevelBadge({ xp, size = "md" }: Props) {
  const { level, title } = lookupLevel(xp)
  const s = SIZE[size]

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${s.outer} rounded-xl border border-accent/25 flex items-center justify-center font-bold font-mono relative overflow-hidden`}
        style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(99,102,241,0.1) 100%)" }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <span className={`${s.num} gradient-text relative`}>{level}</span>
      </div>
      {size !== "sm" && (
        <span className={`${s.label} text-text-muted truncate max-w-[80px] text-center`}>{title}</span>
      )}
    </div>
  )
}
