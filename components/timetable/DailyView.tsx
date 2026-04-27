"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Check, Timer, BookOpen } from "lucide-react"
import { markTaskDone, type TimetableTask } from "@/actions/saveTimetable"
import { toISTDateString } from "@/lib/dateUtils"

interface Props {
  tasks: TimetableTask[]
  onTaskToggle?: () => void
}

export function DailyView({ tasks, onTaskToggle }: Props) {
  const today = toISTDateString()
  const todayTasks = tasks
    .filter((t) => t.date === today)
    .sort((a, b) => a.order - b.order)

  const [localDone, setLocalDone] = useState<Record<string, boolean>>(
    Object.fromEntries(todayTasks.map((t) => [t.task_id, t.done]))
  )
  const [, startTransition] = useTransition()

  function toggle(taskId: string) {
    const next = !localDone[taskId]
    setLocalDone((prev) => ({ ...prev, [taskId]: next }))
    startTransition(async () => {
      await markTaskDone(taskId, next).catch(() => {
        setLocalDone((prev) => ({ ...prev, [taskId]: !next }))
      })
      onTaskToggle?.()
    })
  }

  if (todayTasks.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-text-secondary text-sm">No tasks scheduled for today</p>
      </div>
    )
  }

  const done = todayTasks.filter((t) => localDone[t.task_id]).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Tasks</h3>
        <span className="text-xs text-text-secondary">{done}/{todayTasks.length} done</span>
      </div>

      <div className="w-full bg-surface rounded-full h-1.5">
        <div
          className="bg-success h-1.5 rounded-full transition-all"
          style={{ width: `${todayTasks.length > 0 ? (done / todayTasks.length) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-2">
        {todayTasks.map((task) => {
          const isDone = Boolean(localDone[task.task_id])
          return (
            <div
              key={task.task_id}
              className="flex items-center gap-3 p-3 bg-surface-2 border border-border rounded-xl"
            >
              <button
                onClick={() => toggle(task.task_id)}
                className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  isDone ? "bg-success border-success" : "border-border hover:border-text-secondary"
                }`}
              >
                {isDone && <Check size={13} className="text-background" strokeWidth={3} />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-tight ${isDone ? "line-through text-text-secondary" : "text-text-primary"}`}>
                  {task.chapter_name}
                </p>
                <p className="text-xs text-text-secondary">{task.subject} · {task.duration_minutes} min</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/timetable/pomodoro?task=${task.task_id}&label=${encodeURIComponent(task.chapter_name)}`}
                  className="p-2 rounded-lg bg-surface hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Start Pomodoro"
                >
                  <Timer size={14} className="text-text-secondary" />
                </Link>
                <Link
                  href={`/notes?chapter=${task.chapter_id}`}
                  className="p-2 rounded-lg bg-surface hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="View Notes"
                >
                  <BookOpen size={14} className="text-text-secondary" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
