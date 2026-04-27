"use client"

import { Flame, Target, TrendingUp, Zap } from "lucide-react"
import type { UserProfile } from "@/types/student"
import { predictNEETScore } from "@/lib/predictedScore"

type Props = { profile: UserProfile }

export function ProgressSummaryCards({ profile }: Props) {
  const [low, high] = predictNEETScore(profile.subject_accuracy)
  const hasAccuracy = Object.keys(profile.subject_accuracy).length > 0

  const weakChapters = Object.entries(profile.chapter_health)
    .filter(([, h]) => h < 50)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)

  const cards = [
    {
      icon: <Zap size={16} className="text-warning" />,
      label: "XP This Week",
      value: profile.xp_this_week.toLocaleString(),
      sub: `${profile.xp_total.toLocaleString()} total`,
    },
    {
      icon: <Flame size={16} className="text-warning" />,
      label: "Current Streak",
      value: `${profile.streak_current}d`,
      sub: `Best: ${profile.streak_max}d`,
    },
    {
      icon: <Target size={16} className="text-accent" />,
      label: "Predicted Score",
      value: hasAccuracy ? `${low}–${high}` : "—",
      sub: hasAccuracy ? "out of 720" : "Take a test first",
    },
    {
      icon: <TrendingUp size={16} className="text-success" />,
      label: "Level",
      value: `Lv.${profile.level}`,
      sub: `${profile.xp_total.toLocaleString()} XP`,
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-text-secondary">
              {c.icon}
              <span className="text-xs font-medium">{c.label}</span>
            </div>
            <p className="text-xl font-bold text-text-primary font-mono">{c.value}</p>
            <p className="text-text-secondary text-xs">{c.sub}</p>
          </div>
        ))}
      </div>

      {weakChapters.length > 0 && (
        <div className="bg-surface border border-danger/30 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-danger text-xs font-semibold uppercase tracking-widest">
            Danger Zone
          </p>
          <div className="flex flex-col gap-2">
            {weakChapters.map(([chapterId, health]) => (
              <div key={chapterId} className="flex items-center justify-between">
                <span className="text-text-secondary text-sm capitalize">
                  {chapterId.replace(/-/g, " ")}
                </span>
                <span className="text-danger text-xs font-semibold font-mono">
                  {Math.round(health)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
