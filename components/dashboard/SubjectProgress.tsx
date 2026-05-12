"use client"

import type { PlainUserProfile } from "@/types/student"
import { BookOpen, TrendingUp } from "lucide-react"

type Props = { profile: PlainUserProfile }

const SUBJECT_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  physics:   { color: "#60A5FA", bg: "#60A5FA15", label: "Physics" },
  chemistry: { color: "#C084FC", bg: "#C084FC15", label: "Chemistry" },
  biology:   { color: "#34D399", bg: "#34D39915", label: "Biology" },
  botany:    { color: "#6EE7B7", bg: "#6EE7B715", label: "Botany" },
  zoology:   { color: "#10B981", bg: "#10B98115", label: "Zoology" },
  math:      { color: "#FBBF24", bg: "#FBBF2415", label: "Mathematics" },
  default:   { color: "#D4FF59", bg: "#D4FF5915", label: "Subject" },
}

function getStyle(name: string) {
  const k = name.toLowerCase()
  if (k.includes("phy")) return SUBJECT_STYLES.physics!
  if (k.includes("chem")) return SUBJECT_STYLES.chemistry!
  if (k.includes("bot")) return SUBJECT_STYLES.botany!
  if (k.includes("zoo")) return SUBJECT_STYLES.zoology!
  if (k.includes("bio")) return SUBJECT_STYLES.biology!
  if (k.includes("math")) return SUBJECT_STYLES.math!
  return SUBJECT_STYLES.default!
}

export function SubjectProgress({ profile }: Props) {
  const hasData = Object.keys(profile.subject_accuracy || {}).length > 0

  const subjects = hasData
    ? Object.entries(profile.subject_accuracy).map(([name, accuracy]) => ({
        name, accuracy, style: getStyle(name)
      }))
    : [
        { name: "Physics",   accuracy: 45, style: SUBJECT_STYLES.physics! },
        { name: "Chemistry", accuracy: 62, style: SUBJECT_STYLES.chemistry! },
        { name: "Biology",   accuracy: 80, style: SUBJECT_STYLES.biology! },
      ]

  const avg = subjects.reduce((s, x) => s + x.accuracy, 0) / subjects.length

  return (
    <div className="bg-surface border border-white/6 rounded-[24px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Subject Mastery</h3>
            <p className="text-[11px] text-text-secondary">Based on test performance</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-white/6">
          <TrendingUp size={12} className="text-accent" />
          <span className="text-xs font-semibold text-accent">{Math.round(avg)}% avg</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        {subjects.map((sub) => (
          <div key={sub.name} className="group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: sub.style.color, boxShadow: `0 0 6px ${sub.style.color}60` }}
                />
                <span className="text-sm font-medium text-white">{sub.name}</span>
              </div>
              <span className="text-sm tabular-nums font-semibold" style={{ color: sub.style.color }}>
                {Math.round(sub.accuracy)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(4, sub.accuracy)}%`,
                  background: `linear-gradient(90deg, ${sub.style.color}90, ${sub.style.color})`,
                  boxShadow: `0 0 10px ${sub.style.color}40`
                }}
              />
            </div>
          </div>
        ))}
        {!hasData && (
          <p className="text-xs text-text-muted text-center mt-2 opacity-60">Showing placeholder — take tests to see real data</p>
        )}
      </div>
    </div>
  )
}
