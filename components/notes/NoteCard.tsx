import Link from "next/link"
import { Star, Eye, FileText, PenLine } from "lucide-react"
import type { Note } from "@/types/note"

interface Props {
  note: Note & { note_id: string }
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(value) ? "text-warning fill-warning" : "text-border"}
        />
      ))}
      <span className="text-xs text-text-secondary ml-1">{value.toFixed(1)}</span>
    </div>
  )
}

export function NoteCard({ note }: Props) {
  return (
    <Link
      href={`/notes/${note.note_id}`}
      className="flex flex-col gap-3 p-4 bg-surface-2 border border-border rounded-2xl active:opacity-70 transition-opacity hover:border-accent/40"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
          {note.type === "HANDWRITTEN" ? (
            <PenLine size={18} className="text-text-secondary" />
          ) : (
            <FileText size={18} className="text-text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary leading-tight line-clamp-2">
            {note.title}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">{note.creator_name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
            {note.subject}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary capitalize">
            {note.type === "HANDWRITTEN" ? "Handwritten" : "Typed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-xs text-text-secondary">
            <Eye size={11} />
            <span>{note.view_count.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {note.rating_count > 0 && (
        <StarRating value={note.aggregate_rating} />
      )}
    </Link>
  )
}
