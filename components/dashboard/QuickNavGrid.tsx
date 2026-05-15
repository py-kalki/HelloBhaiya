"use client"

import Link from "next/link"
import {
  Map, BookOpen, Clock, Trophy, Swords, Brain,
  BarChart2, Settings, ArrowUpRight, Sparkles, type LucideIcon
} from "lucide-react"

type Props = { exam: string }

type NavItem = {
  href: string
  icon: LucideIcon
  label: string
  description: string
  color: string
  bg: string
  badge?: string
  comingSoon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/roadmap",
    icon: Map,
    label: "Roadmap",
    description: "Chapter-wise progress",
    color: "#6EE7B7",
    bg: "#6EE7B710",
  },
  {
    href: "/notes",
    icon: BookOpen,
    label: "Notes",
    description: "Curated study material",
    color: "#A78BFA",
    bg: "#A78BFA10",
  },
  {
    href: "/timetable",
    icon: Clock,
    label: "Timetable",
    description: "Plan & track sessions",
    color: "#FCD34D",
    bg: "#FCD34D10",
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    label: "Leaderboard",
    description: "Weekly XP rankings",
    color: "#D4FF59",
    bg: "#D4FF5910",
  },
  {
    href: "/battle",
    icon: Swords,
    label: "Battle Mode",
    description: "1v1 live quiz duels",
    color: "#F87171",
    bg: "#F8717110",
    badge: "Phase 2",
    comingSoon: true,
  },
  {
    href: "/doubt",
    icon: Brain,
    label: "AI Doubt Solver",
    description: "Step-by-step help",
    color: "#C084FC",
    bg: "#C084FC10",
    badge: "Phase 2",
    comingSoon: true,
  },
  {
    href: "/analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "Performance insights",
    color: "#94A3B8",
    bg: "#94A3B810",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    description: "Account & preferences",
    color: "#94A3B8",
    bg: "#94A3B810",
  },
]

export function QuickNavGrid({ exam: _exam }: Props) {
  return (
    <div className="bg-surface rounded-[24px] p-6 border border-white/6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text-primary">Explore Platform</p>
          <p className="text-xs text-text-muted mt-0.5">Quick access to everything</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.comingSoon ? "#" : item.href}
              className={`group relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                item.comingSoon
                  ? "opacity-50 cursor-not-allowed pointer-events-none bg-surface-2/50 border-white/4"
                  : "hover:-translate-y-0.5 bg-surface-2/60 border-white/6 hover:border-white/12 hover:bg-surface-2"
              }`}
            >
              {/* per-card hover glow */}
              {!item.comingSoon && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}10, transparent 65%)` }}
                />
              )}

              {item.badge && (
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface border border-border text-text-muted tracking-wide uppercase">
                  {item.badge}
                </span>
              )}

              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                style={{
                  backgroundColor: item.bg,
                  borderColor: `${item.color}25`,
                }}
              >
                <Icon size={17} style={{ color: item.color }} />
              </div>

              <div className="relative z-10">
                <p className="text-sm font-semibold text-text-primary leading-tight">{item.label}</p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{item.description}</p>
              </div>

              {!item.comingSoon && (
                <ArrowUpRight
                  size={12}
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: item.color }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
