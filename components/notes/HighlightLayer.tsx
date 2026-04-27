"use client"

import { useRef, useState } from "react"
import { saveHighlight, deleteHighlight } from "@/actions/saveHighlight"
import type { HighlightData } from "@/actions/saveHighlight"

const COLOUR_MAP = {
  yellow: "rgba(224, 192, 120, 0.4)",
  green:  "rgba(144, 212, 168, 0.4)",
  pink:   "rgba(224, 144, 144, 0.4)",
}

interface Props {
  noteId: string
  page: number
  scale: number
  isActive: boolean
  colour: "yellow" | "green" | "pink"
  initialHighlights: HighlightData[]
}

export function HighlightLayer({ noteId, page, scale, isActive, colour, initialHighlights }: Props) {
  const [highlights, setHighlights] = useState<HighlightData[]>(initialHighlights)
  const layerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<{ startX: number; startY: number } | null>(null)
  const [draft, setDraft] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  function getRelPos(e: React.MouseEvent) {
    const rect = layerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!isActive) return
    const pos = getRelPos(e)
    dragging.current = { startX: pos.x, startY: pos.y }
    setDraft({ x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isActive || !dragging.current) return
    const pos = getRelPos(e)
    setDraft({
      x: Math.min(dragging.current.startX, pos.x),
      y: Math.min(dragging.current.startY, pos.y),
      w: Math.abs(pos.x - dragging.current.startX),
      h: Math.abs(pos.y - dragging.current.startY),
    })
  }

  async function onMouseUp() {
    if (!isActive || !dragging.current || !draft) return
    dragging.current = null

    if (draft.w < 10 || draft.h < 5) {
      setDraft(null)
      return
    }

    const newH: HighlightData = {
      page,
      x:       draft.x / scale,
      y:       draft.y / scale,
      width:   draft.w / scale,
      height:  draft.h / scale,
      colour,
      created_at: Date.now(),
    }

    setHighlights((prev) => [...prev, newH])
    setDraft(null)

    await saveHighlight(noteId, {
      page:   newH.page,
      x:      newH.x,
      y:      newH.y,
      width:  newH.width,
      height: newH.height,
      colour: newH.colour,
    }).catch(() => {
      setHighlights((prev) => prev.filter((h) => h.created_at !== newH.created_at))
    })
  }

  async function removeHighlight(h: HighlightData) {
    setHighlights((prev) => prev.filter((x) => x.created_at !== h.created_at))
    await deleteHighlight(noteId, h.created_at)
  }

  return (
    <div
      ref={layerRef}
      className="absolute inset-0"
      style={{ cursor: isActive ? "crosshair" : "default" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {highlights.map((h) => (
        <div
          key={h.created_at}
          onClick={(e) => { if (!isActive) { e.stopPropagation(); removeHighlight(h) } }}
          style={{
            position:  "absolute",
            left:      h.x * scale,
            top:       h.y * scale,
            width:     h.width * scale,
            height:    h.height * scale,
            background: COLOUR_MAP[h.colour],
            borderRadius: 2,
            cursor: isActive ? "crosshair" : "pointer",
          }}
        />
      ))}
      {draft && (
        <div
          style={{
            position:   "absolute",
            left:       draft.x,
            top:        draft.y,
            width:      draft.w,
            height:     draft.h,
            background: COLOUR_MAP[colour],
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  )
}
