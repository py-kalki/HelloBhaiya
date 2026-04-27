"use client"

import dynamic from "next/dynamic"
import type { PlainUserProfile } from "@/types/student"

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

type Props = { profile: PlainUserProfile }

export function WeaknessRadar({ profile }: Props) {
  const subjects = getSubjects(profile.exam)
  const data = subjects.map((subject) => ({
    subject,
    accuracy: Math.round(profile.subject_accuracy[subject] ?? 0),
    fullMark: 100,
  }))

  const hasData = data.some((d) => d.accuracy > 0)

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 animate-slide-up delay-75">
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest">
          📡 Weakness Radar
        </p>
      </div>

      {hasData ? (
        <WeaknessRadarChart data={data} />
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-3xl">
            📡
          </div>
          <div>
            <p className="text-text-primary font-semibold text-sm">No data yet</p>
            <p className="text-text-muted text-xs mt-1">Take your first test to see your radar.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap pt-1">
        <LegendDot color="#6EE7B7" label="Solid (≥75%)" />
        <LegendDot color="#FCD34D" label="Needs Work (50–74%)" />
        <LegendDot color="#F87171" label="Danger (<50%)" />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
      <span className="text-text-muted text-[11px]">{label}</span>
    </div>
  )
}
