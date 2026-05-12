"use client"

import { useMemo, useState, useRef } from "react"
import { Calendar, Flame } from "lucide-react"
import type { ActivityLog } from "@/types/student"

type Serialized = Omit<ActivityLog, "created_at"> & { created_at: number }

export function ActivityHeatmap({ activities = [] }: { activities?: Serialized[] }) {
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({
    show: false, text: "", x: 0, y: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const activityData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activityMap = new Map<string, number>()
    activities.forEach(act => {
      const d = new Date(act.created_at)
      d.setHours(0, 0, 0, 0)
      const key = d.toDateString()
      activityMap.set(key, (activityMap.get(key) || 0) + 1)
    })

    return Array.from({ length: 98 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (97 - i))
      const count = activityMap.get(date.toDateString()) || 0
      let level = 0
      if (count > 5) level = 4
      else if (count > 3) level = 3
      else if (count > 1) level = 2
      else if (count === 1) level = 1
      return { date, level, count }
    })
  }, [activities])

  // group into weeks
  const weeks: (typeof activityData)[] = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  const totalActions = activityData.reduce((a, c) => a + c.count, 0)
  const activeDays = activityData.filter(d => d.level > 0).length

  // current streak calc
  let currentStreak = 0
  for (let i = activityData.length - 1; i >= 0; i--) {
    if (activityData[i]!.level > 0) currentStreak++
    else break
  }

  const getCellStyle = (level: number) => {
    switch (level) {
      case 4: return { backgroundColor: "#D4FF59", boxShadow: "0 0 8px #D4FF5960" }
      case 3: return { backgroundColor: "#a6c430" }
      case 2: return { backgroundColor: "#6b8a18" }
      case 1: return { backgroundColor: "#3d5009" }
      default: return { backgroundColor: "rgba(255,255,255,0.05)" }
    }
  }

  const handleMouseEnter = (e: React.MouseEvent, day: (typeof activityData)[number]) => {
    if (!containerRef.current) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    setTooltip({
      show: true,
      text: `${day.count} ${day.count === 1 ? "activity" : "activities"} · ${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
    })
  }

  return (
    <div ref={containerRef} className="bg-surface border border-white/6 rounded-[24px] p-6 flex flex-col w-full overflow-hidden relative">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
            <Calendar size={15} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Study Activity</h3>
            <p className="text-[11px] text-text-secondary">Last 98 days</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-base font-black text-white">{totalActions}</span>
              <span className="text-[10px] text-text-muted">total actions</span>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div className="flex flex-col items-end">
              <span className="text-base font-black text-white">{activeDays}</span>
              <span className="text-[10px] text-text-muted">active days</span>
            </div>
            {currentStreak > 0 && (
              <>
                <div className="w-px h-8 bg-white/8" />
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Flame size={12} style={{ color: "#FB923C" }} />
                    <span className="text-base font-black" style={{ color: "#FB923C" }}>{currentStreak}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">streak</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={() => setTooltip(p => ({ ...p, show: false }))}
                  className="w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-transform duration-150 hover:scale-125 hover:z-10"
                  style={getCellStyle(day.level)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* tooltip */}
      <div
        className={`absolute pointer-events-none z-50 bg-black/90 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap transition-all duration-150 ${
          tooltip.show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
      >
        {tooltip.text}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
      </div>

      {/* legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-text-muted">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} className="w-3 h-3 rounded-[2px]" style={getCellStyle(l)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
