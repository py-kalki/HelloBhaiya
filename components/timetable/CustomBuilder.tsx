"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addDays, toISTDateString } from "@/lib/dateUtils"
import { saveTimetable, type TimetableTask } from "@/actions/saveTimetable"
import neatSyllabus from "@/scripts/data/neatSyllabus.json"
import type { SyllabusChapter } from "@/types/syllabus"

const SYLLABUS = neatSyllabus as SyllabusChapter[]
const CHAPTER_IDS = SYLLABUS.map((c) => ({
  chapter_id: c.chapter_id,
  chapter_name: c.name,
  subject: c.subject,
}))

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CustomBuilder() {
  const router = useRouter()
  const [studyHours, setStudyHours]   = useState(4)
  const [restDays, setRestDays]       = useState<number[]>([0])
  const [examDate, setExamDate]       = useState("")
  const [startDate, setStartDate]     = useState(toISTDateString())
  const [saving, startTransition]     = useTransition()
  const [preview, setPreview]         = useState<TimetableTask[]>([])

  function toggleRestDay(day: number) {
    setRestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  function generate() {
    if (!examDate || !startDate) return

    const start = new Date(startDate)
    const end   = new Date(examDate)
    const totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000))
    const activeDays = Array.from({ length: totalDays }, (_, i) => {
      const d = addDays(start, i)
      return { date: toISTDateString(d), dow: d.getDay() }
    }).filter(({ dow }) => !restDays.includes(dow))

    const chaptersPerDay = Math.ceil(studyHours / 1.5)
    const minutesPerChapter = Math.round((studyHours * 60) / chaptersPerDay)

    const shuffled = [...CHAPTER_IDS].sort(() => Math.random() - 0.5)
    const tasks: TimetableTask[] = []
    let chapterIdx = 0

    for (const { date } of activeDays) {
      for (let slot = 0; slot < chaptersPerDay; slot++) {
        const chapter = shuffled[chapterIdx % shuffled.length]!
        tasks.push({
          task_id:          `${date}-${slot}`,
          date,
          subject:          chapter.subject,
          chapter_id:       chapter.chapter_id,
          chapter_name:     chapter.chapter_name,
          duration_minutes: minutesPerChapter,
          done:             false,
          order:            slot,
        })
        chapterIdx++
      }
    }

    setPreview(tasks.slice(0, 21))
  }

  function save() {
    if (!examDate || !startDate || preview.length === 0) return
    startTransition(async () => {
      const allTasks = buildAllTasks()
      await saveTimetable({
        exam_date:            examDate,
        start_date:           startDate,
        study_hours_per_day:  studyHours,
        rest_days:            restDays,
        tasks:                allTasks,
      })
      router.push("/timetable")
    })
  }

  function buildAllTasks(): TimetableTask[] {
    if (!examDate || !startDate) return []
    const start = new Date(startDate)
    const end   = new Date(examDate)
    const totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000))
    const activeDays = Array.from({ length: totalDays }, (_, i) => {
      const d = addDays(start, i)
      return { date: toISTDateString(d), dow: d.getDay() }
    }).filter(({ dow }) => !restDays.includes(dow))

    const chaptersPerDay = Math.ceil(studyHours / 1.5)
    const minutesPerChapter = Math.round((studyHours * 60) / chaptersPerDay)
    const shuffled = [...CHAPTER_IDS].sort(() => Math.random() - 0.5)
    const tasks: TimetableTask[] = []
    let chapterIdx = 0

    for (const { date } of activeDays) {
      for (let slot = 0; slot < chaptersPerDay; slot++) {
        const chapter = shuffled[chapterIdx % shuffled.length]!
        tasks.push({
          task_id: `${date}-${slot}`,
          date,
          subject: chapter.subject,
          chapter_id: chapter.chapter_id,
          chapter_name: chapter.chapter_name,
          duration_minutes: minutesPerChapter,
          done: false,
          order: slot,
        })
        chapterIdx++
      }
    }
    return tasks
  }

  const todayStr = toISTDateString()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs text-text-secondary font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            min={todayStr}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-sm text-text-primary focus:outline-none focus:border-accent min-h-[44px]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-text-secondary font-medium">Exam Date</label>
          <input
            type="date"
            value={examDate}
            min={startDate || todayStr}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-3 py-3 text-sm text-text-primary focus:outline-none focus:border-accent min-h-[44px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary font-medium">Study Hours / Day</label>
          <span className="text-sm font-bold text-text-primary">{studyHours}h</span>
        </div>
        <input
          type="range"
          min={1}
          max={12}
          value={studyHours}
          onChange={(e) => setStudyHours(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-text-secondary">
          <span>1h</span><span>12h</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-medium">Rest Days (no study)</label>
        <div className="flex gap-2 flex-wrap">
          {DAY_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => toggleRestDay(i)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
                restDays.includes(i)
                  ? "bg-danger/20 text-danger border border-danger/40"
                  : "bg-surface-2 border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generate}
          disabled={!examDate || !startDate}
          className="flex-1 py-3 rounded-xl bg-surface-2 border border-border text-sm font-medium text-text-primary hover:bg-surface disabled:opacity-40 min-h-[44px]"
        >
          Preview Plan
        </button>
        <button
          onClick={save}
          disabled={saving || preview.length === 0 || !examDate}
          className="flex-1 py-3 rounded-xl bg-accent text-background text-sm font-bold disabled:opacity-40 min-h-[44px]"
        >
          {saving ? "Saving…" : "Save Plan"}
        </button>
      </div>

      {preview.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-secondary">Preview (first 3 days)</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {preview.map((task) => (
              <div
                key={task.task_id}
                className="flex items-center gap-2 px-3 py-2 bg-surface-2 rounded-lg"
              >
                <span className="text-xs text-text-secondary w-20 shrink-0">{task.date}</span>
                <span className="text-xs text-text-primary flex-1 truncate">{task.chapter_name}</span>
                <span className="text-xs text-text-secondary shrink-0">{task.duration_minutes}m</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
