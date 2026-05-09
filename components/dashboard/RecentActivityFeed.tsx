"use client"

import { Activity, BookOpen, Target, CheckCircle2, Star } from "lucide-react"

import type { ActivityLog } from "@/types/student"
import { formatDistanceToNow } from "date-fns"

export function RecentActivityFeed({ activities }: { activities: (Omit<ActivityLog, "created_at"> & { created_at: number })[] }) {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case "test": return { icon: Target, color: "text-accent bg-accent/10 border-accent/20" }
      case "study": return { icon: BookOpen, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" }
      case "achievement": return { icon: Star, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" }
      case "goal": return { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }
      default: return { icon: Activity, color: "text-white bg-white/10 border-white/20" }
    }
  }

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col h-full lg:col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Activity size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Recent Activity</h3>
          <p className="text-[11px] text-text-secondary">Your latest actions</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-32 opacity-60">
            <Activity size={24} className="text-text-muted mb-2" />
            <p className="text-sm text-text-secondary">No recent activity.</p>
          </div>
        ) : activities.map((act, index) => {
          const { icon: Icon, color } = getIconAndColor(act.type)
          return (
            <div key={act.id} className="relative flex gap-4">
              {/* Timeline Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-5 top-10 bottom-[-16px] w-px bg-white/5" />
              )}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 z-10 ${color}`}>
                <Icon size={18} />
              </div>
              
              <div className="flex-1 bg-surface-2 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-white">{act.title}</h4>
                  <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">
                    {formatDistanceToNow(act.created_at, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{act.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
