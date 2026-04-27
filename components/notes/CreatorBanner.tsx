import { ExternalLink, PenLine, FileText } from "lucide-react"
import type { Note } from "@/types/note"

interface Props {
  note: Pick<Note, "creator_name" | "creator_handle" | "source_url" | "type">
}

export function CreatorBanner({ note }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border">
      <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
        {note.type === "HANDWRITTEN" ? (
          <PenLine size={14} className="text-text-secondary" />
        ) : (
          <FileText size={14} className="text-text-secondary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{note.creator_name}</p>
        {note.creator_handle && (
          <p className="text-xs text-text-secondary truncate">{note.creator_handle}</p>
        )}
      </div>
      {note.source_url && (
        <a
          href={note.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-accent hover:text-text-primary transition-colors shrink-0 min-h-[44px] px-2"
        >
          <ExternalLink size={12} />
          Source
        </a>
      )}
    </div>
  )
}
