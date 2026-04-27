"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"
import { saveTimetable, type TimetableTask } from "@/actions/saveTimetable"
import { addDays, toISTDateString } from "@/lib/dateUtils"
import neatSyllabus from "@/scripts/data/neatSyllabus.json"
import type { SyllabusChapter } from "@/types/syllabus"

const SYLLABUS = neatSyllabus as SyllabusChapter[]

const TEMPLATES = [
  {
    id: "crash-course",
    name: "3-Month Crash Course",
    description: "6h/day · 6 days/week · All subjects",
    studyHours: 6,
    restDays: [0],
    months: 3,
  },
  {
    id: "balanced",
    name: "Balanced 6-Month Plan",
    description: "4h/day · 5 days/week · Mixed pace",
    studyHours: 4,
    restDays: [0, 6],
    months: 6,
  },
  {
    id: "intense",
    name: "Final 1-Month Revision",
    description: "8h/day · 7 days/week · Revision focus",
    studyHours: 8,
    restDays: [],
    months: 1,
  },
]

function buildTasks(template: (typeof TEMPLATES)[0], startDate: string): TimetableTask[] {
  const start = new Date(startDate)
  const end = addDays(start, template.months * 30)
  const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000)
  const chapters = SYLLABUS.map((c) => ({
    chapter_id:   c.chapter_id,
    chapter_name: c.name,
    subject:      c.subject,
  }))

  const activeDays = Array.from({ length: totalDays }, (_, i) => {
    const d = addDays(start, i)
    return { date: toISTDateString(d), dow: d.getDay() }
  }).filter(({ dow }) => !template.restDays.includes(dow))

  const chaptersPerDay = Math.ceil(template.studyHours / 1.5)
  const minutesPerChapter = Math.round((template.studyHours * 60) / chaptersPerDay)
  const shuffled = [...chapters].sort(() => Math.random() - 0.5)
  const tasks: TimetableTask[] = []
  let idx = 0

  for (const { date } of activeDays) {
    for (let slot = 0; slot < chaptersPerDay; slot++) {
      const chapter = shuffled[idx % shuffled.length]!
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
      idx++
    }
  }
  return tasks
}

export function TemplateList() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function apply(template: (typeof TEMPLATES)[0]) {
    const startDate = toISTDateString()
    const examDate  = toISTDateString(addDays(new Date(), template.months * 30))
    const tasks = buildTasks(template, startDate)

    startTransition(async () => {
      await saveTimetable({
        exam_date:           examDate,
        start_date:          startDate,
        study_hours_per_day: template.studyHours,
        rest_days:           template.restDays,
        tasks,
      })
      router.push("/timetable")
    })
  }

  return (
    <div className="space-y-3">
      {TEMPLATES.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-4 p-4 bg-surface-2 border border-border rounded-2xl"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{t.name}</p>
            <p className="text-xs text-text-secondary mt-0.5">{t.description}</p>
          </div>
          <button
            onClick={() => apply(t)}
            disabled={pending}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent text-background text-xs font-bold rounded-xl disabled:opacity-40 min-h-[44px]"
          >
            <Zap size={12} />
            Apply
          </button>
        </div>
      ))}
    </div>
  )
}
