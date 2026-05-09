"use client"

import type { PlainUserProfile } from "@/types/student"
import { BookOpen } from "lucide-react"

type Props = { profile: PlainUserProfile }

export function SubjectProgress({ profile }: Props) {
  // If no subject data yet, use some mock/placeholder data so it doesn't look empty
  const hasData = Object.keys(profile.subject_accuracy || {}).length > 0
  
  const subjects = hasData 
    ? Object.entries(profile.subject_accuracy).map(([name, accuracy]) => ({
        name,
        accuracy,
        color: getColorForSubject(name)
      }))
    : [
        { name: "Physics", accuracy: 45, color: "bg-blue-400" },
        { name: "Chemistry", accuracy: 62, color: "bg-purple-400" },
        { name: "Biology", accuracy: 80, color: "bg-emerald-400" },
      ]

  function getColorForSubject(name: string) {
    const lower = name.toLowerCase()
    if (lower.includes("phy")) return "bg-blue-400"
    if (lower.includes("chem")) return "bg-purple-400"
    if (lower.includes("bio") || lower.includes("bot") || lower.includes("zoo")) return "bg-emerald-400"
    if (lower.includes("math")) return "bg-orange-400"
    return "bg-accent"
  }

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Subject Mastery</h3>
          <p className="text-[11px] text-text-secondary">Based on recent tests</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {subjects.map((sub) => (
          <div key={sub.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-medium">{sub.name}</span>
              <span className="text-text-secondary tabular-nums">{Math.round(sub.accuracy)}%</span>
            </div>
            <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${sub.color} transition-all duration-1000 ease-out relative`}
                style={{ width: `${Math.max(5, sub.accuracy)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
        {!hasData && (
          <p className="text-xs text-text-muted text-center mt-2">Take tests to see real data</p>
        )}
      </div>
    </div>
  )
}
