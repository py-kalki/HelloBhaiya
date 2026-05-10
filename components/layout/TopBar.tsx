"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FlaskConical, Map, BookOpen,
  Swords, CalendarDays, BarChart2, Zap, Flame,
  ChevronRight, User, Moon, Sun, Settings, Video
} from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { lookupLevel } from "@/lib/scoring"
import type { UserProfile } from "@/types/student"

const NAV_LINKS = [
  { href: "/dashboard",  label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/test/build", label: "Test",        Icon: FlaskConical    },
  { href: "/roadmap",    label: "Roadmap",     Icon: Map             },
  { href: "/notes",      label: "Notes",       Icon: BookOpen        },
  { href: "/revision",   label: "Revision",    Icon: Moon            },
  { href: "/timetable",  label: "Timetable",   Icon: CalendarDays    },
  { href: "/study",      label: "Co-Study",    Icon: Video           },
  { href: "/analytics",  label: "Analytics",   Icon: BarChart2       },
  { href: "/battle",     label: "Battle",      Icon: Swords          },
]

export function TopBar({ initialProfile }: { initialProfile?: UserProfile | null }) {
  const { profile } = useUserProfile(initialProfile)
  const pathname = usePathname()

  const levelData = lookupLevel(profile?.xp_total ?? 0)

  const getInitials = (name?: string) => {
    if (!name?.trim()) return "?"
    const parts = name.trim().split(/\s+/)
    const first = parts[0]?.[0] || "?"
    if (parts.length >= 2) {
      const last = parts[parts.length - 1]?.[0] || ""
      return (first + last).toUpperCase()
    }
    return first.toUpperCase()
  }

  return (
    <header className="flex sticky top-0 z-40 items-center justify-between px-4 md:px-6 h-[60px] bg-background/70 backdrop-blur-2xl border-b border-white/[0.06]">

      {/* ── Left: Logo + Nav Links ── */}
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className="flex items-center mr-4 shrink-0 group"
        >
          <img
            src="/hellobhaiya-logo.svg"
            alt="HelloBhaiya"
            className="h-7 w-auto object-contain group-hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="hidden md:block h-5 w-px bg-white/10 mr-3" />

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-text-muted hover:text-white hover:bg-white/[0.05]"
                  }
                `}
              >
                <Icon
                  size={14}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={`shrink-0 transition-colors ${isActive ? "text-accent" : "text-inherit"}`}
                />
                {label}
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-accent/60 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* ── Right: Stats + Profile ── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* XP + Streak pill */}
        <div className="flex items-center bg-surface border border-white/[0.06] rounded-full px-1 py-1 gap-0.5">
          
          {/* Streak Pill */}
          <div className="group relative flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/5 transition-colors cursor-default">
            <Flame size={13} className="text-orange-400 fill-orange-400/30" />
            <span className="text-xs font-bold text-white tabular-nums">
              {profile?.streak_current ?? 0}
            </span>
            <span className="text-[10px] text-text-muted">streak</span>
            
            {/* Streak Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-surface border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none scale-95 group-hover:scale-100 before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-surface">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Current Streak</span>
                <span className="text-sm font-black text-orange-400">{profile?.streak_current ?? 0} <span className="text-[10px] text-text-muted font-semibold">days</span></span>
              </div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Max Streak</span>
                <span className="text-xs font-bold text-text-secondary">{profile?.streak_max ?? 0} <span className="text-[10px] text-text-muted">days</span></span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Complete at least one test or daily goal every day to keep your streak burning!
              </p>
            </div>
          </div>
          
          <div className="w-px h-4 bg-white/10" />
          
          {/* XP Pill */}
          <div className="group relative flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/5 transition-colors cursor-default">
            <Zap size={13} className="text-accent fill-accent/30" />
            <span className="text-xs font-bold text-white tabular-nums">
              {(profile?.xp_total ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-text-muted">xp</span>

            {/* XP Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-surface border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none scale-95 group-hover:scale-100 before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-surface">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Total XP</span>
                <span className="text-sm font-black text-accent">{(profile?.xp_total ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">This Week</span>
                <span className="text-xs font-bold text-accent/80">+{profile?.xp_this_week ?? 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-white">{levelData.level}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Current Level</span>
                  <span className="text-xs font-bold text-white">{levelData.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          title="Settings"
        >
          <Settings size={15} />
        </Link>

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="relative w-8 h-8 md:w-8 md:h-8 shrink-0 rounded-full bg-surface border border-white/10 overflow-hidden hover:border-accent/60 transition-all duration-200 group"
          title="Profile"
        >
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt={profile.name ?? "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet/50 to-accent/20 flex items-center justify-center text-[11px] font-bold text-white">
              {getInitials(profile?.name)}
            </div>
          )}
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent border border-background" />
        </Link>
      </div>
    </header>
  )
}
