"use client"

import { Play, ArrowRight, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

// subject to gradient mapping
const subjectColors: Record<string, { from: string; to: string; glow: string }> = {
  physics:   { from: "#3B82F6", to: "#1D4ED8", glow: "#3B82F620" },
  chemistry: { from: "#A78BFA", to: "#7C3AED", glow: "#A78BFA20" },
  biology:   { from: "#10B981", to: "#047857", glow: "#10B98120" },
  math:      { from: "#F59E0B", to: "#D97706", glow: "#F59E0B20" },
  default:   { from: "#D4FF59", to: "#a6c430", glow: "#D4FF5920" },
}

function getSubjectColor(subject: string) {
  const key = subject.toLowerCase()
  if (key.includes("phy")) return subjectColors.physics!
  if (key.includes("chem")) return subjectColors.chemistry!
  if (key.includes("bio") || key.includes("bot") || key.includes("zoo")) return subjectColors.biology!
  if (key.includes("math")) return subjectColors.math!
  return subjectColors.default!
}

export function ResumeLearningCard({ lastFocusModule }: { lastFocusModule?: any }) {
  if (!lastFocusModule) return null

  const focus = {
    subject:  lastFocusModule.subject || "Physics",
    topic:    lastFocusModule.topic || "Kinematics",
    type:     lastFocusModule.type || "Video Lecture",
    progress: lastFocusModule.progress || 65,
    link:     lastFocusModule.link || "/notes/physics/kinematics",
  }

  const colors = getSubjectColor(focus.subject)

  return (
    <div className="relative bg-surface border border-white/6 rounded-[24px] p-6 overflow-hidden group">
      {/* ambient glow */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 blur-[80px] opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent 70%)`, opacity: 0.15 }}
      />
      
      {/* top diagonal accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px]"
        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: `${colors.from}18`, borderColor: `${colors.from}30` }}
            >
              <BookOpen size={18} style={{ color: colors.from }} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: colors.from }}>
                Resume Learning
              </p>
              <h3 className="text-lg font-bold text-white leading-tight">{focus.subject}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-2 border border-white/6 rounded-full">
            <Sparkles size={11} className="text-accent" />
            <span className="text-[10px] font-medium text-text-secondary">In progress</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-3">
          <span className="text-text-muted">Topic: </span>
          <span className="text-white font-semibold">{focus.topic}</span>
          <span className="text-text-muted ml-2">· {focus.type}</span>
        </p>

        {/* progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-text-muted">Progress</span>
            <span className="font-semibold" style={{ color: colors.from }}>{focus.progress}%</span>
          </div>
          <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{
                width: `${focus.progress}%`,
                background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                boxShadow: `0 0 12px ${colors.from}50`
              }}
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={focus.link}
            className="flex-1 py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] text-sm"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, color: "#fff" }}
          >
            <Play size={15} fill="white" />
            Continue Lesson
          </Link>
          <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-2 text-white border border-white/6 hover:border-white/20 hover:bg-white/5 transition-colors">
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
