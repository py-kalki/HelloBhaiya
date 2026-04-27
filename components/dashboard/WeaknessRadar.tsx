"use client"

import dynamic from "next/dynamic"
import type { UserProfile } from "@/types/student"

const WeaknessRadarChart = dynamic(() => import("./WeaknessRadarChart"), {
  ssr: false,
  loading: () => <div className="h-56 rounded-xl bg-surface-2 animate-pulse" />,
})

const NEET_SUBJECTS = ["Physics", "Chemistry", "Biology"]
const JEE_SUBJECTS  = ["Physics", "Chemistry", "Mathematics"]

function getSubjects(exam: string): string[] {
  if (exam === "NEET") return NEET_SUBJECTS
  if (exam === "JEE_MAINS" || exam === "JEE_ADV") return JEE_SUBJECTS
  return NEET_SUBJECTS
}

type Props = { profile: UserProfile }

export function WeaknessRadar({ profile }: Props) {
  const subjects = getSubjects(profile.exam)
  const data = subjects.map((subject) => ({
    subject,
    accuracy: Math.round(profile.subject_accuracy[subject] ?? 0),
    fullMark: 100,
  }))

  const hasData = data.some((d) => d.accuracy > 0)

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-widest">
        Weakness Radar
      </p>

      {hasData ? (
        <WeaknessRadarChart data={data} />
      ) : (
        <div className="h-56 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-3xl">🎯</span>
          <p className="text-text-secondary text-sm">
            Take your first test to see your radar.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <LegendDot color="#90D4A8" label="Solid (≥75%)" />
        <LegendDot color="#E0C078" label="Needs Work (50–74%)" />
        <LegendDot color="#E09090" label="Danger Zone (<50%)" />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-text-secondary text-xs">{label}</span>
    </div>
  )
}
