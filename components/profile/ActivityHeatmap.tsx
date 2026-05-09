"use client"

import { useMemo, useState, useRef } from "react"
import { Calendar } from "lucide-react"
import type { ActivityLog } from "@/types/student"

export function ActivityHeatmap({ activities = [] }: { activities?: (Omit<ActivityLog, "created_at"> & { created_at: number })[] }) {
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({
    show: false, text: "", x: 0, y: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)
  // Group real activity data by day for the last 14 weeks (98 days)
  const activityData = useMemo(() => {
    const data = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Create a map of date string -> count of activities
    const activityMap = new Map<string, number>()
    activities.forEach(act => {
      const d = new Date(act.created_at)
      d.setHours(0, 0, 0, 0)
      const key = d.toDateString()
      activityMap.set(key, (activityMap.get(key) || 0) + 1)
    })

    for (let i = 0; i < 98; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (97 - i))
      const key = date.toDateString()
      const count = activityMap.get(key) || 0
      
      let level = 0
      if (count > 5) level = 4
      else if (count > 3) level = 3
      else if (count > 1) level = 2
      else if (count === 1) level = 1

      data.push({
        date,
        level,
        count
      })
    }
    return data
  }, [activities])

  const getColor = (level: number) => {
    switch (level) {
      case 4: return "bg-accent border-accent shadow-[0_0_8px_rgba(203,247,69,0.5)]"
      case 3: return "bg-[#a6d123] border-[#a6d123]"
      case 2: return "bg-[#7ba10e] border-[#7ba10e]"
      case 1: return "bg-[#4f6e03] border-[#4f6e03]"
      default: return "bg-surface-2 border-white/5"
    }
  }

  // Group by weeks
  const weeks = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  const totalActions = activityData.reduce((acc, curr) => acc + curr.count, 0)
  const activeDays = activityData.filter(d => d.level > 0).length

  const handleMouseEnter = (e: React.MouseEvent, day: any) => {
    if (!containerRef.current) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    
    setTooltip({
      show: true,
      text: `${day.count} activities on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      x: rect.left - containerRect.left + (rect.width / 2),
      y: rect.top - containerRect.top - 10
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }))
  }

  return (
    <div ref={containerRef} className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col w-full overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Calendar size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Study Activity</h3>
            <p className="text-xs text-text-secondary">Your effort over the last 98 days</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-white font-medium">{totalActions}</span>
            <span className="text-text-muted text-xs">Total XP Actions</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{activeDays}</span>
            <span className="text-text-muted text-xs">Active Days</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-1.5 min-w-max pt-8">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {week.map((day, dayIdx) => (
                <div 
                  key={dayIdx} 
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={handleMouseLeave}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[3px] border transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${getColor(day.level)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Tooltip */}
      <div 
        className={`absolute pointer-events-none z-50 bg-black/90 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap transition-all duration-200 ${
          tooltip.show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-50%, -100%)'
        }}
      >
        {tooltip.text}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-text-muted">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-[2px] bg-surface-2 border border-white/5"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#4f6e03] border border-[#4f6e03]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#7ba10e] border border-[#7ba10e]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-[#a6d123] border border-[#a6d123]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-accent border border-accent"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
