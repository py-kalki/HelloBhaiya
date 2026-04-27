"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Check, BookOpen, Zap } from "lucide-react"
import { markTopicComplete } from "@/actions/markTopicComplete"

interface Props {
  chapterId: string
  chapterName: string
  topics: string[]
  initialProgress: Record<number, boolean>
}

export function TopicChecklist({ chapterId, chapterName, topics, initialProgress }: Props) {
  const [progress, setProgress] = useState<Record<number, boolean>>(initialProgress)
  const [pending, startTransition] = useTransition()

  function toggle(index: number) {
    const next = !progress[index]
    setProgress((prev) => ({ ...prev, [index]: next }))
    startTransition(() => {
      markTopicComplete(chapterId, index, next).catch(() => {
        setProgress((prev) => ({ ...prev, [index]: !next }))
      })
    })
  }

  const doneCount = Object.values(progress).filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{chapterName}</h3>
        <span className="text-xs text-text-secondary">
          {doneCount}/{topics.length} topics
        </span>
      </div>

      <div className="w-full bg-surface rounded-full h-1.5">
        <div
          className="bg-success h-1.5 rounded-full transition-all"
          style={{ width: `${topics.length > 0 ? (doneCount / topics.length) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-1">
        {topics.map((topic, i) => {
          const done = Boolean(progress[i])
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-1 rounded-lg active:bg-surface-2 transition-colors"
            >
              <button
                onClick={() => toggle(i)}
                disabled={pending}
                className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors ${
                  done
                    ? "bg-success border-success"
                    : "border-border hover:border-text-secondary"
                }`}
              >
                {done && <Check size={12} className="text-background" strokeWidth={3} />}
              </button>
              <span
                className={`text-sm flex-1 ${
                  done ? "line-through text-text-secondary" : "text-text-primary"
                }`}
              >
                {topic}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <Link
          href={`/test/build?chapter=${chapterId}&count=5`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-2 border border-border text-sm text-text-primary hover:bg-surface transition-colors min-h-[44px]"
        >
          <Zap size={14} />
          Quick Test
        </Link>
        <Link
          href={`/notes?chapter=${chapterId}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-2 border border-border text-sm text-text-primary hover:bg-surface transition-colors min-h-[44px]"
        >
          <BookOpen size={14} />
          Notes
        </Link>
      </div>
    </div>
  )
}
