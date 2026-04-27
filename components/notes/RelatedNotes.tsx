import Link from "next/link"
import { Star, FileText, PenLine } from "lucide-react"
import type { Note } from "@/types/note"

interface Props {
  notes: (Note & { note_id: string })[]
  currentNoteId: string
}

export function RelatedNotes({ notes, currentNoteId }: Props) {
  const related = notes.filter((n) => n.note_id !== currentNoteId).slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">Related Notes</h3>
      <div className="space-y-2">
        {related.map((note) => (
          <Link
            key={note.note_id}
            href={`/notes/${note.note_id}`}
            className="flex items-center gap-3 p-3 bg-surface-2 border border-border rounded-xl active:opacity-70 transition-opacity hover:border-accent/40"
          >
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
              {note.type === "HANDWRITTEN" ? (
                <PenLine size={13} className="text-text-secondary" />
              ) : (
                <FileText size={13} className="text-text-secondary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary line-clamp-1">{note.title}</p>
              <p className="text-xs text-text-secondary">{note.creator_name}</p>
            </div>
            {note.rating_count > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-warning shrink-0">
                <Star size={10} className="fill-warning" />
                <span>{note.aggregate_rating.toFixed(1)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
