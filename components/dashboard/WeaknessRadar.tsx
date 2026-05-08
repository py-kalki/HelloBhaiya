"use client"

import dynamic from "next/dynamic"
import type { PlainUserProfile } from "@/types/student"
import { Activity, Plus } from "lucide-react"

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
    <div className="relative h-full min-h-[300px] bg-surface rounded-[28px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-text-secondary" />
          <p className="text-text-secondary font-medium text-sm">
            Subject Mastery
          </p>
        </div>
        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="relative flex-1 flex flex-col">
        {hasData ? (
          <div className="flex-1 min-h-[200px]">
             <WeaknessRadarChart data={data} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center">
               <Activity size={24} className="text-text-muted" />
            </div>
            <div>
              <p className="text-text-primary font-medium text-lg">No data yet</p>
              <p className="text-text-muted text-sm mt-1 max-w-[200px] mx-auto">Take your first test to activate the radar.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
           <LegendDot color="#D4FF59" label="Solid" />
           <LegendDot color="#A27BFA" label="Needs Work" />
        </div>
        <span className="text-xs text-text-muted font-medium cursor-pointer hover:text-white transition-colors">View Details</span>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-text-secondary text-xs font-medium">{label}</span>
    </div>
  )
}
