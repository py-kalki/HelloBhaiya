"use client"

import { lookupLevel } from "@/lib/scoring"

type Props = { xp: number; size?: "sm" | "md" | "lg" }

const SIZE = {
  sm: { outer: "w-8 h-8",   num: "text-xs",  label: "text-[9px]"  },
  md: { outer: "w-11 h-11", num: "text-sm",  label: "text-[10px]" },
  lg: { outer: "w-16 h-16", num: "text-2xl",  label: "text-sm"     },
}

export function LevelBadge({ xp, size = "md" }: Props) {
  const { level, title } = lookupLevel(xp)
  const s = SIZE[size]

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${s.outer} rounded-2xl bg-accent text-black flex items-center justify-center font-bold relative overflow-hidden shadow-[0_0_15px_rgba(212,255,89,0.3)]`}>
        {/* Inner glow/highlight effect */}
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity" />
        <span className={`${s.num} relative tracking-tight`}>{level}</span>
      </div>
      {size !== "sm" && (
        <span className={`${s.label} text-text-secondary font-medium tracking-tight truncate max-w-[80px] text-center`}>{title}</span>
      )}
    </div>
  )
}
