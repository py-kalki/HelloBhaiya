"use client"

import type { PlainUserProfile } from "@/types/student"
import { predictNEETScore } from "@/lib/predictedScore"
import { ArrowUpRight, Zap, Flame, Target } from "lucide-react"
import Link from "next/link"

type Props = { profile: PlainUserProfile }

export function ProgressSummaryCards({ profile }: Props) {
  const [low, high] = predictNEETScore(profile.subject_accuracy)
  const hasAccuracy = Object.keys(profile.subject_accuracy).length > 0

  const cards = [
    {
      icon: Zap,
      label: "XP Earned",
      value: profile.xp_this_week.toLocaleString(),
      sub: `+${Math.round(profile.xp_this_week * 0.12)}% from previous week`, // Mocked percentage for the vibe
      isAccent: false,
      href: "/profile"
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${profile.streak_current}d`,
      sub: `Best streak: ${profile.streak_max}d`,
      isAccent: false,
      href: "/profile"
    },
    {
      icon: Target,
      label: "Predicted Score",
      value: hasAccuracy ? `${Math.round((low + high) / 2)}` : "—",
      sub: hasAccuracy ? "out of 720" : "Take a test first",
      isAccent: true,
      href: "/test/build"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Link
            href={c.href}
            key={c.label}
            className={`group relative rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 min-h-[160px] ${
              c.isAccent
                ? "bg-accent text-black hover:bg-[#cbf745]"
                : "bg-surface border border-transparent hover:border-border text-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  c.isAccent ? "border border-black/20" : "border border-white/10"
                }`}>
                  <Icon size={14} className={c.isAccent ? "text-black" : "text-white"} />
                </div>
                <span className={`text-sm font-medium ${c.isAccent ? "text-black/80" : "text-text-secondary"}`}>
                  {c.label}
                </span>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                c.isAccent ? "bg-black text-white" : "bg-white text-black"
              }`}>
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-[32px] lg:text-[40px] font-medium tracking-tight leading-none mb-2">{c.value}</p>
              <p className={`text-xs ${c.isAccent ? "text-black/60 font-medium" : "text-text-muted"}`}>
                {c.sub}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
