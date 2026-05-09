"use client"

import type { PlainUserProfile } from "@/types/student"
import { ArrowUpRight, Zap, Flame, Target, CalendarClock } from "lucide-react"
import Link from "next/link"

type Props = { profile: PlainUserProfile; predictedScore: [number, number] }

export function ProgressSummaryCards({ profile, predictedScore }: Props) {
  const [low, high] = predictedScore
  const hasAccuracy = Object.keys(profile.subject_accuracy).length > 0

  const testsThisMonth = profile.xp_total > 0 ? Math.floor(profile.xp_total / 100) : 0
  const testsCompleted = Math.min(testsThisMonth, 12)

  const cards = [
    {
      icon: Zap,
      label: "XP Earned",
      value: profile.xp_this_week.toLocaleString(),
      sub: `+${Math.round(profile.xp_this_week * 0.12)}% from previous week`,
      isAccent: false,
      href: "/profile"
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${profile.streak_current}d`,
      sub: `Best: ${profile.streak_max}d • Next milestone: ${getNextStreakMilestone(profile.streak_current)}d`,
      isAccent: false,
      href: "/profile"
    },
    {
      icon: Target,
      label: "Predicted Score",
      value: hasAccuracy ? `${Math.round((low + high) / 2)}` : "—",
      sub: hasAccuracy ? `${low}-${high} range • out of 720` : "Take a test first",
      isAccent: true,
      href: "/test/build"
    },
    {
      icon: CalendarClock,
      label: "Tests Completed",
      value: testsCompleted.toString(),
      sub: "This month",
      isAccent: false,
      href: "/analytics"
    },
  ]

  function getNextStreakMilestone(current: number): number {
    const milestones = [7, 14, 30, 50, 100]
    return milestones.find(m => m > current) ?? 100
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Link
            href={c.href}
            key={c.label}
            className={`group relative rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 min-h-[140px] ${
              c.isAccent
                ? "bg-accent text-black hover:bg-[#cbf745]"
                : "bg-surface border border-transparent hover:border-border text-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  c.isAccent ? "border border-black/20" : "border border-white/10"
                }`}>
                  <Icon size={14} className={c.isAccent ? "text-black" : "text-white"} />
                </div>
                <span className={`text-xs font-medium ${c.isAccent ? "text-black/80" : "text-text-secondary"}`}>
                  {c.label}
                </span>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                c.isAccent ? "bg-black text-white" : "bg-white text-black"
              }`}>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-[28px] font-medium tracking-tight leading-none mb-1">{c.value}</p>
              <p className={`text-[11px] ${c.isAccent ? "text-black/60 font-medium" : "text-text-muted"}`}>
                {c.sub}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
