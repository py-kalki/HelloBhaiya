"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, TrendingUp } from "lucide-react"
import { getSyllabus } from "@/lib/syllabusData"

type WeakChapter = {
  id: string
  name: string
  subject: string
  health: number
}

type Props = {
  chapterHealth: Record<string, number>
  exam: string
}

function getSubjectColor(subject: string): string {
  if (subject === "Biology") return "text-[#90D4A8]"
  if (subject === "Physics") return "text-violet"
  return "text-[#E0C078]"
}
function getSubjectBg(subject: string): string {
  if (subject === "Biology") return "bg-[#90D4A8]/10 border-[#90D4A8]/20"
  if (subject === "Physics") return "bg-violet/10 border-violet/20"
  return "bg-[#E0C078]/10 border-[#E0C078]/20"
}

export function DangerZoneCard({ chapterHealth, exam }: Props) {
  const syllabus = getSyllabus(exam)

  // Build a flat lookup of chapter id → { name, subject }
  const chapterLookup: Record<string, { name: string; subject: string }> = {}
  for (const subj of syllabus) {
    for (const ch of subj.chapters) {
      chapterLookup[ch.id] = { name: ch.name, subject: subj.name }
    }
  }

  // Get all chapters with a health score, sort ascending (weakest first)
  const weak: WeakChapter[] = Object.entries(chapterHealth)
    .filter(([, h]) => h < 75)
    .map(([id, health]) => ({
      id,
      name: chapterLookup[id]?.name ?? id,
      subject: chapterLookup[id]?.subject ?? "Unknown",
      health,
    }))
    .sort((a, b) => a.health - b.health)
    .slice(0, 3)

  if (weak.length === 0) {
    return (
      <div className="p-6 bg-surface rounded-[28px] flex items-center gap-4 border border-[#90D4A8]/20">
        <div className="w-12 h-12 rounded-full bg-[#90D4A8]/10 border border-[#90D4A8]/20 flex items-center justify-center shrink-0">
          <TrendingUp size={22} className="text-[#90D4A8]" />
        </div>
        <div>
          <p className="text-text-primary font-semibold">All green! 🎉</p>
          <p className="text-text-secondary text-sm mt-0.5">No danger-zone chapters — keep practising to maintain scores.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-[28px] p-6 border border-[#E09090]/15 relative overflow-hidden">
      {/* Subtle danger glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-[#E09090]/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E09090]/15 border border-[#E09090]/25 flex items-center justify-center">
            <AlertTriangle size={15} className="text-[#E09090]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Danger Zone</p>
            <p className="text-xs text-text-muted">Weakest chapters that need urgent revision</p>
          </div>
        </div>
        <Link
          href="/roadmap"
          className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {weak.map((ch, i) => {
          const label = ch.health === 0 ? "Not Started" : ch.health < 50 ? "Danger Zone" : "Needs Work"
          const labelColor = ch.health === 0 ? "text-text-muted" : ch.health < 50 ? "text-[#E09090]" : "text-[#E0C078]"
          const barColor = ch.health === 0 ? "bg-surface-2" : ch.health < 50 ? "bg-[#E09090]" : "bg-[#E0C078]"

          return (
            <Link
              key={ch.id}
              href={`/test/build?chapter=${ch.id}`}
              className="group flex items-center gap-4 p-3.5 bg-surface-2 rounded-2xl border border-border hover:border-[#E09090]/30 transition-all duration-200"
            >
              {/* Rank */}
              <span className="w-5 text-center text-xs font-bold text-text-muted shrink-0">{i + 1}</span>

              {/* Chapter info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-medium text-text-primary truncate">{ch.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getSubjectBg(ch.subject)} ${getSubjectColor(ch.subject)}`}>
                    {ch.subject}
                  </span>
                </div>
                {/* Health bar */}
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${ch.health}%` }}
                  />
                </div>
              </div>

              {/* Score + label */}
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${labelColor}`}>{ch.health}%</p>
                <p className={`text-[10px] font-medium ${labelColor} opacity-80`}>{label}</p>
              </div>

              <ArrowRight size={14} className="text-text-muted group-hover:text-[#E09090] shrink-0 transition-colors" />
            </Link>
          )
        })}
      </div>

      <Link
        href="/test/build"
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E09090]/20 text-[#E09090] text-sm font-semibold hover:bg-[#E09090]/10 transition-all"
      >
        Fix These Chapters
        <ArrowRight size={15} />
      </Link>
    </div>
  )
}
