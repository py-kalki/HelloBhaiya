import Link from "next/link"
import { ChevronRight, AlertTriangle, Clock } from "lucide-react"
import type { ChapterWithProgress, ChapterStatus } from "@/types/syllabus"

const STATUS_CONFIG: Record<
  ChapterStatus,
  { label: string; dot: string; badge: string }
> = {
  SOLID:        { label: "Solid",       dot: "bg-success",    badge: "text-success bg-success/10" },
  NEEDS_WORK:   { label: "Needs Work",  dot: "bg-warning",    badge: "text-warning bg-warning/10" },
  DANGER_ZONE:  { label: "Danger Zone", dot: "bg-danger",     badge: "text-danger bg-danger/10" },
  NOT_STARTED:  { label: "Not Started", dot: "bg-border",     badge: "text-text-secondary bg-surface-2" },
}

interface Props {
  chapter: ChapterWithProgress
  subject: string
}

export function ChapterListItem({ chapter, subject }: Props) {
  const cfg = STATUS_CONFIG[chapter.status]

  return (
    <Link
      href={`/roadmap/${subject.toLowerCase()}?chapter=${chapter.chapter_id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-2 border border-border active:opacity-70 transition-opacity min-h-[64px]"
    >
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-text-primary leading-tight truncate">
            {chapter.name}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {chapter.status === "DANGER_ZONE" && (
              <AlertTriangle size={12} className="text-danger" />
            )}
            {chapter.needsRevision && chapter.status !== "NOT_STARTED" && (
              <span className="flex items-center gap-0.5 text-xs text-warning">
                <Clock size={10} />
                Revise
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-text-secondary">{chapter.unit}</p>
          {chapter.status !== "NOT_STARTED" && (
            <span className="text-xs text-text-secondary">·</span>
          )}
          {chapter.status !== "NOT_STARTED" && (
            <p className="text-xs text-text-secondary">{Math.round(chapter.health)}% health</p>
          )}
        </div>
      </div>

      <ChevronRight size={16} className="text-text-secondary shrink-0" />
    </Link>
  )
}
