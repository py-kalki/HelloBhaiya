"use client"

import Link from "next/link"
import { Zap, RotateCcw, BookMarked, ChevronRight, Flame, Settings2, Timer, Target, type LucideIcon } from "lucide-react"

type TestMode = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  bg: string
  border: string
  highlight?: boolean
}

const MODES: TestMode[] = [
  {
    id: "CUSTOM",
    label: "Custom Test",
    description: "Pick subjects, chapters & difficulty",
    icon: Zap,
    href: "/test/build?mode=CUSTOM",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/25",
    highlight: true,
  },
  {
    id: "PYQ",
    label: "PYQ Mode",
    description: "Previous year questions by year",
    icon: BookMarked,
    href: "/test/build?mode=PYQ",
    color: "text-[#E0C078]",
    bg: "bg-[#E0C078]/10",
    border: "border-[#E0C078]/20",
  },
  {
    id: "RAPID_FIRE",
    label: "Rapid Fire",
    description: "30s per question, speed scoring",
    icon: Flame,
    href: "/test/build?mode=RAPID_FIRE",
    color: "text-[#E09090]",
    bg: "bg-[#E09090]/10",
    border: "border-[#E09090]/20",
  },
  {
    id: "MISTAKE_REPLAY",
    label: "Mistake Replay",
    description: "Re-attempt your wrong answers",
    icon: RotateCcw,
    href: "/test/build?mode=MISTAKE_REPLAY",
    color: "text-violet",
    bg: "bg-violet/10",
    border: "border-violet/20",
  },
]

type BuilderFeature = {
  icon: LucideIcon
  label: string
  description: string
}

const BUILDER_FEATURES: BuilderFeature[] = [
  { icon: Target, label: "Subjects & Chapters", description: "Multi-select any combination" },
  { icon: Settings2, label: "Difficulty Mix", description: "Easy/Medium/Hard sliders" },
  { icon: Timer, label: "Custom Timer", description: "Set your own time limit" },
]

export function QuickTestLaunch() {
  return (
    <div className="bg-surface rounded-[28px] p-6 relative overflow-hidden">
      {/* Subtle glow in corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[70px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text-primary">Test Builder</p>
          <p className="text-xs text-text-muted mt-0.5">Launch a test in seconds</p>
        </div>
        <Link
          href="/test/build"
          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-white transition-colors"
        >
          Advanced <ChevronRight size={13} />
        </Link>
      </div>

      {/* Builder Features Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {BUILDER_FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border"
            >
              <Icon size={12} className="text-text-secondary" />
              <span className="text-[11px] text-text-secondary font-medium">{f.label}</span>
            </div>
          )
        })}
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`group flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${mode.bg} ${mode.border} ${
                mode.highlight ? "shadow-[0_0_20px_rgba(212,255,89,0.06)]" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-black/20 border ${mode.border}`}>
                <Icon size={18} className={mode.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${mode.highlight ? "text-accent" : "text-text-primary"}`}>
                  {mode.label}
                </p>
                <p className="text-[11px] text-text-muted leading-snug mt-0.5 line-clamp-1">{mode.description}</p>
              </div>
              <ChevronRight size={15} className={`shrink-0 ${mode.color} opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
            </Link>
          )
        })}
      </div>

      {/* CTA */}
      <Link
        href="/test/build"
        className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent text-black font-bold text-sm hover:bg-[#cbf745] transition-all active:scale-[0.98]"
      >
        <Zap size={16} />
        Build a Full Test
      </Link>
    </div>
  )
}
