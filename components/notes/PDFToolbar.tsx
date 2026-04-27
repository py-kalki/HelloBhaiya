"use client"

import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Highlighter } from "lucide-react"

interface Props {
  page: number
  totalPages: number
  scale: number
  onPrev: () => void
  onNext: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  highlightMode: boolean
  onToggleHighlight: () => void
  highlightColour: "yellow" | "green" | "pink"
  onColourChange: (c: "yellow" | "green" | "pink") => void
}

const COLOURS: { id: "yellow" | "green" | "pink"; bg: string }[] = [
  { id: "yellow", bg: "bg-warning" },
  { id: "green",  bg: "bg-success" },
  { id: "pink",   bg: "bg-danger" },
]

export function PDFToolbar({
  page,
  totalPages,
  scale,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  highlightMode,
  onToggleHighlight,
  highlightColour,
  onColourChange,
}: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border overflow-x-auto scrollbar-none">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="p-2 rounded-lg hover:bg-surface-2 disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <ChevronLeft size={16} className="text-text-primary" />
      </button>

      <span className="text-xs text-text-secondary shrink-0 min-w-[56px] text-center">
        {page} / {totalPages || "—"}
      </span>

      <button
        onClick={onNext}
        disabled={totalPages > 0 && page >= totalPages}
        className="p-2 rounded-lg hover:bg-surface-2 disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <ChevronRight size={16} className="text-text-primary" />
      </button>

      <div className="w-px h-5 bg-border shrink-0 mx-1" />

      <button
        onClick={onZoomOut}
        disabled={scale <= 0.5}
        className="p-2 rounded-lg hover:bg-surface-2 disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <ZoomOut size={16} className="text-text-primary" />
      </button>

      <span className="text-xs text-text-secondary shrink-0 w-10 text-center">
        {Math.round(scale * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        disabled={scale >= 3}
        className="p-2 rounded-lg hover:bg-surface-2 disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <ZoomIn size={16} className="text-text-primary" />
      </button>

      <div className="w-px h-5 bg-border shrink-0 mx-1" />

      <button
        onClick={onToggleHighlight}
        className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
          highlightMode ? "bg-warning/20 text-warning" : "hover:bg-surface-2 text-text-secondary"
        }`}
        title="Highlight mode"
      >
        <Highlighter size={16} />
      </button>

      {highlightMode && (
        <div className="flex items-center gap-1.5">
          {COLOURS.map(({ id, bg }) => (
            <button
              key={id}
              onClick={() => onColourChange(id)}
              className={`w-5 h-5 rounded-full ${bg} transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center ${
                highlightColour === id ? "ring-2 ring-white ring-offset-1 ring-offset-surface" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
