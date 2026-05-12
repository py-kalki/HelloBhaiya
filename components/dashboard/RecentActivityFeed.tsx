"use client"

import { Activity, BookOpen, Target, CheckCircle2, Star, Zap } from "lucide-react"
import type { ActivityLog } from "@/types/student"
import { formatDistanceToNow } from "date-fns"

const TYPE_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  test:        { icon: Target,        color: "#D4FF59", bg: "#D4FF5912", label: "Test" },
  study:       { icon: BookOpen,      color: "#60A5FA", bg: "#60A5FA12", label: "Study" },
  achievement: { icon: Star,          color: "#F59E0B", bg: "#F59E0B12", label: "Achievement" },
  goal:        { icon: CheckCircle2,  color: "#34D399", bg: "#34D39912", label: "Goal" },
  xp:          { icon: Zap,           color: "#C084FC", bg: "#C084FC12", label: "XP" },
  default:     { icon: Activity,      color: "#94A3B8", bg: "#94A3B812", label: "Activity" },
}

type Serialized = Omit<ActivityLog, "created_at"> & { created_at: number }

export function RecentActivityFeed({ activities }: { activities: Serialized[] }) {
  return (
    <div className="bg-surface border border-white/6 rounded-[24px] p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
          <Activity size={15} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <p className="text-[11px] text-text-secondary">Your latest actions</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-28 opacity-50">
            <Activity size={22} className="text-text-muted mb-2" />
            <p className="text-sm text-text-secondary">No activity yet — get started!</p>
          </div>
        ) : activities.map((act, idx) => {
          const s = TYPE_STYLES[act.type] ?? TYPE_STYLES.default!
          const Icon = s.icon
          const isLast = idx === activities.length - 1

          return (
            <div key={act.id} className="relative flex gap-3">
              {/* timeline */}
              {!isLast && (
                <div className="absolute left-4 top-9 bottom-[-12px] w-px bg-white/6" />
              )}

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 z-10 mt-0.5"
                style={{ backgroundColor: s.bg, borderColor: `${s.color}30` }}
              >
                <Icon size={14} style={{ color: s.color }} />
              </div>

              <div className="flex-1 bg-surface-2/60 border border-white/5 rounded-2xl px-4 py-3 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white leading-snug">{act.title}</h4>
                  <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0 mt-0.5">
                    {formatDistanceToNow(act.created_at, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">{act.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
