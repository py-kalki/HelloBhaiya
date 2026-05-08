import Link from "next/link"
import { ArrowLeft, AlertTriangle, Clock } from "lucide-react"
import type { ChapterWithProgress } from "@/types/syllabus"
import { TopicChecklist } from "./TopicChecklist"

const STATUS_COLORS: Record<string, string> = {
  SOLID:       "text-success",
  NEEDS_WORK:  "text-warning",
  DANGER_ZONE: "text-danger",
  NOT_STARTED: "text-text-secondary",
}

const STATUS_LABELS: Record<string, string> = {
  SOLID:       "Solid",
  NEEDS_WORK:  "Needs Work",
  DANGER_ZONE: "Danger Zone",
  NOT_STARTED: "Not Started",
}

interface Props {
  chapter: ChapterWithProgress
  subject: string
  initialProgress: Record<number, boolean>
}

export function ChapterDetailPanel({ chapter, subject, initialProgress }: Props) {
  const statusColor = STATUS_COLORS[chapter.status] ?? "text-text-secondary"
  const statusLabel = STATUS_LABELS[chapter.status] ?? chapter.status

  return (
    <div className="space-y-4">
      <Link
        href={`/roadmap/${subject.toLowerCase()}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
      >
        <ArrowLeft size={16} />
        Back to {subject}
      </Link>

      <div className="bg-surface-2 border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-text-secondary">{chapter.unit}</p>
            <h2 className="text-lg font-bold text-text-primary mt-0.5">{chapter.name}</h2>
          </div>
          <div className="text-right shrink-0">
            {chapter.status === "DANGER_ZONE" && (
              <div className="flex items-center gap-1 justify-end mb-1">
                <AlertTriangle size={12} className="text-danger" />
                <span className="text-xs text-danger">Priority</span>
              </div>
            )}
            {chapter.needsRevision && chapter.status !== "NOT_STARTED" && (
              <div className="flex items-center gap-1 justify-end mb-1">
                <Clock size={12} className="text-warning" />
                <span className="text-xs text-warning">Revise Soon</span>
              </div>
            )}
            <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
            {chapter.status !== "NOT_STARTED" && (
              <p className="text-xs text-text-secondary mt-0.5">
                {Math.round(chapter.health)}% health
              </p>
            )}
          </div>
        </div>

        {chapter.status !== "NOT_STARTED" && (
          <div className="w-full bg-surface rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                chapter.status === "SOLID"
                  ? "bg-success"
                  : chapter.status === "NEEDS_WORK"
                  ? "bg-warning"
                  : "bg-danger"
              }`}
              style={{ width: `${chapter.health}%` }}
            />
          </div>
        )}
      </div>

      <div className="bg-surface-2 border border-border rounded-2xl p-4">
        <TopicChecklist
          chapterId={chapter.chapter_id}
          chapterName={chapter.name}
          topics={chapter.topics}
          initialProgress={initialProgress}
        />
      </div>
    </div>
  )
}
