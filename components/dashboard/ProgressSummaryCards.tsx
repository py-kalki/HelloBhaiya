"use client"

import type { PlainUserProfile } from "@/types/student"
import { predictNEETScore } from "@/lib/predictedScore"

type Props = { profile: PlainUserProfile }

type StatCard = {
  label: string
  value: string
  sub: string
  from: string
  to: string
  icon: string
  textClass: string
}

export function ProgressSummaryCards({ profile }: Props) {
  const [low, high] = predictNEETScore(profile.subject_accuracy)
  const hasAccuracy = Object.keys(profile.subject_accuracy).length > 0

  const cards: StatCard[] = [
    {
      icon: "⚡",
      label: "XP This Week",
      value: profile.xp_this_week.toLocaleString(),
      sub: `${profile.xp_total.toLocaleString()} total`,
      from: "from-amber-500/12",
      to: "to-amber-500/3",
      textClass: "gradient-text-gold",
    },
    {
      icon: "🔥",
      label: "Streak",
      value: `${profile.streak_current}d`,
      sub: `Best: ${profile.streak_max}d`,
      from: "from-orange-500/12",
      to: "to-orange-500/3",
      textClass: profile.streak_current > 0 ? "text-warning" : "text-text-primary",
    },
    {
      icon: "🎯",
      label: "Predicted NEET",
      value: hasAccuracy ? `${low}–${high}` : "—",
      sub: hasAccuracy ? "out of 720" : "Take a test first",
      from: "from-cyan-500/12",
      to: "to-cyan-500/3",
      textClass: hasAccuracy ? "gradient-text-success" : "text-text-primary",
    },
    {
      icon: "🏅",
      label: "Level",
      value: `Lv.${profile.level}`,
      sub: `${profile.xp_total.toLocaleString()} XP`,
      from: "from-violet-500/12",
      to: "to-violet-500/3",
      textClass: "gradient-text",
    },
  ]

  const weakChapters = Object.entries(profile.chapter_health)
    .filter(([, h]) => h < 50)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-3 animate-slide-up delay-150">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`relative bg-gradient-to-br ${c.from} ${c.to} border border-border rounded-2xl p-4 flex flex-col gap-2 overflow-hidden card-hover`}
          >
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs font-medium">{c.label}</span>
              <span className="text-lg">{c.icon}</span>
            </div>
            <p className={`text-2xl font-bold font-mono leading-none ${c.textClass}`}>{c.value}</p>
            <p className="text-text-muted text-xs">{c.sub}</p>
          </div>
        ))}
      </div>

      {weakChapters.length > 0 && (
        <div className="bg-surface border border-danger/20 rounded-2xl p-4 flex flex-col gap-3"
          style={{ boxShadow: "0 0 20px rgba(248,113,113,0.06)" }}>
          <div className="flex items-center gap-2">
            <span className="text-danger text-xs font-bold uppercase tracking-widest">⚠ Danger Zone</span>
          </div>
          <div className="flex flex-col gap-2">
            {weakChapters.map(([id, health]) => (
              <div key={id} className="flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-text-secondary text-xs capitalize leading-none">
                    {id.replace(/-/g, " ")}
                  </span>
                  <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-danger/60"
                      style={{ width: `${Math.round(health)}%` }}
                    />
                  </div>
                </div>
                <span className="text-danger text-xs font-bold font-mono shrink-0">{Math.round(health)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
