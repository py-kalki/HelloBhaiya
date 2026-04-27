import { addDays, toISTDateString, toIST } from "@/lib/dateUtils"
import type { TimetableTask } from "@/actions/saveTimetable"

interface Props {
  tasks: TimetableTask[]
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function WeeklyBar({ tasks }: Props) {
  const today = new Date()
  const dayOfWeek = toIST(today).getDay()
  const weekStart = addDays(today, -dayOfWeek)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = toISTDateString(addDays(weekStart, i))
    const dayTasks = tasks.filter((t) => t.date === date)
    const done = dayTasks.filter((t) => t.done).length
    const total = dayTasks.length
    return { date, dayName: DAY_NAMES[i]!, done, total }
  })

  const todayStr = toISTDateString(today)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary">This Week</h3>
      <div className="flex gap-1.5">
        {days.map(({ date, dayName, done, total }) => {
          const isToday = date === todayStr
          const pct = total > 0 ? done / total : 0
          const barColor =
            pct === 1 ? "bg-success" : pct > 0 ? "bg-warning" : "bg-border"

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-16 bg-surface-2 rounded-lg overflow-hidden flex flex-col justify-end">
                <div
                  className={`w-full transition-all ${barColor}`}
                  style={{ height: `${Math.max(4, pct * 100)}%` }}
                />
              </div>
              <span
                className={`text-xs ${
                  isToday ? "text-accent font-bold" : "text-text-secondary"
                }`}
              >
                {dayName}
              </span>
              {total > 0 && (
                <span className="text-[10px] text-text-secondary">
                  {done}/{total}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
