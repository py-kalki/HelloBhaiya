"use client"

import type { PlainUserProfile } from "@/types/student"
import { ArrowUpRight, Zap, Flame, Target, CalendarClock } from "lucide-react"
import Link from "next/link"

type Props = { profile: PlainUserProfile; predictedScore: [number, number] }

function getNextStreakMilestone(current: number): number {
  const milestones = [7, 14, 30, 50, 100]
  return milestones.find(m => m > current) ?? 100
}

export function ProgressSummaryCards({ profile, predictedScore }: Props) {
  const [low, high] = predictedScore
  const hasAccuracy = Object.keys(profile.subject_accuracy).length > 0

  const testsCompleted = Math.min(Math.floor(profile.xp_total / 100), 12)

  const cards = [
    {
      icon: Zap,
      label: "XP This Week",
      value: profile.xp_this_week.toLocaleString(),
      sub: `+${Math.round(profile.xp_this_week * 0.12)}% from last week`,
      accent: "#D4FF59",
      href: "/profile",
      isGreen: false
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${profile.streak_current}d`,
      sub: `Best: ${profile.streak_max}d · Next: ${getNextStreakMilestone(profile.streak_current)}d`,
      accent: "#FB923C",
      href: "/profile",
      isGreen: false
    },
    {
      icon: Target,
      label: "Predicted Score",
      value: hasAccuracy ? `${Math.round((low + high) / 2)}` : "—",
      sub: hasAccuracy ? `${low}–${high} range · out of 720` : "Take a test first",
      accent: "#D4FF59",
      href: "/test/build",
      isGreen: true  // accent card
    },
    {
      icon: CalendarClock,
      label: "Tests Completed",
      value: testsCompleted.toString(),
      sub: "This month",
      accent: "#A78BFA",
      href: "/analytics",
      isGreen: false
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Link
            href={c.href}
            key={c.label}
            className={`group relative rounded-[24px] p-5 flex flex-col justify-between transition-all duration-300 min-h-[148px] overflow-hidden ${
              c.isGreen
                ? "bg-accent text-black"
                : "bg-surface border border-white/6 hover:border-white/12"
            }`}
          >
            {/* subtle glow on hover for non-accent cards */}
            {!c.isGreen && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]"
                style={{ background: `radial-gradient(circle at 50% 0%, ${c.accent}0A, transparent 70%)` }}
              />
            )}

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center border"
                  style={c.isGreen
                    ? { backgroundColor: "rgba(0,0,0,0.15)", borderColor: "rgba(0,0,0,0.2)" }
                    : { backgroundColor: `${c.accent}15`, borderColor: `${c.accent}25` }
                  }
                >
                  <Icon size={14} style={c.isGreen ? { color: "#000" } : { color: c.accent }} />
                </div>
                <span className={`text-xs font-semibold ${c.isGreen ? "text-black/70" : "text-text-secondary"}`}>
                  {c.label}
                </span>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                c.isGreen ? "bg-black text-white" : "bg-white/8 text-white border border-white/10"
              }`}>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </div>
            </div>

            <div className="mt-auto relative z-10">
              <p className={`text-[30px] font-bold tracking-tight leading-none mb-1 ${c.isGreen ? "text-black" : "text-white"}`}>
                {c.value}
              </p>
              <p className={`text-[11px] ${c.isGreen ? "text-black/55 font-medium" : "text-text-muted"}`}>
                {c.sub}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
