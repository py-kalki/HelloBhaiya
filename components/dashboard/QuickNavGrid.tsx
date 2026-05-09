"use client"

import Link from "next/link"
import {
  Map, BookOpen, Clock, Trophy, Swords, Brain,
  BarChart2, Settings, ArrowUpRight
} from "lucide-react"

type Props = { exam: string }

type NavItem = {
  href: string
  icon: React.ElementType
  label: string
  description: string
  color: string
  bg: string
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/roadmap",
    icon: Map,
    label: "Roadmap",
    description: "Chapter-wise progress",
    color: "text-[#90D4A8]",
    bg: "bg-[#90D4A8]/10 border-[#90D4A8]/20",
  },
  {
    href: "/notes",
    icon: BookOpen,
    label: "Notes",
    description: "Curated study material",
    color: "text-violet",
    bg: "bg-violet/10 border-violet/20",
  },
  {
    href: "/timetable",
    icon: Clock,
    label: "Timetable",
    description: "Plan & track sessions",
    color: "text-[#E0C078]",
    bg: "bg-[#E0C078]/10 border-[#E0C078]/20",
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    label: "Leaderboard",
    description: "Weekly XP rankings",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    href: "/battle",
    icon: Swords,
    label: "Battle Mode",
    description: "1v1 live quiz duels",
    color: "text-[#E09090]",
    bg: "bg-[#E09090]/10 border-[#E09090]/20",
    badge: "Phase 2",
  },
  {
    href: "/doubt",
    icon: Brain,
    label: "AI Doubt Solver",
    description: "Get step-by-step help",
    color: "text-[#A78BFA]",
    bg: "bg-[#A78BFA]/10 border-[#A78BFA]/20",
    badge: "Phase 2",
  },
  {
    href: "/analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "Performance insights",
    color: "text-text-secondary",
    bg: "bg-surface-2 border-border",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    description: "Account & preferences",
    color: "text-text-secondary",
    bg: "bg-surface-2 border-border",
  },
]

export function QuickNavGrid({ exam: _exam }: Props) {
  return (
    <div className="bg-surface rounded-[28px] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text-primary">Explore Platform</p>
          <p className="text-xs text-text-muted mt-0.5">All features at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isPhase2 = item.badge === "Phase 2"
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                isPhase2
                  ? "opacity-60 cursor-not-allowed pointer-events-none bg-surface-2 border-border"
                  : "hover:border-white/10 hover:-translate-y-0.5 bg-surface-2 border-border hover:bg-surface"
              }`}
            >
              {item.badge && (
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface border border-border text-text-muted tracking-wide uppercase">
                  {item.badge}
                </span>
              )}
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.bg}`}>
                <Icon size={17} className={item.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary leading-tight">{item.label}</p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{item.description}</p>
              </div>
              {!isPhase2 && (
                <ArrowUpRight
                  size={13}
                  className="absolute top-3 right-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
