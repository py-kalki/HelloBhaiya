"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

type Props = {
  chapterAccuracy: Record<string, number>
}

export function WeakAreaAlert({ chapterAccuracy }: Props) {
  const weak = Object.entries(chapterAccuracy)
    .filter(([, acc]) => acc < 60)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)

  if (weak.length === 0) return null

  function toLabel(id: string): string {
    return id.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-danger/40 bg-danger/5">
      <div className="flex items-center gap-2 text-danger text-sm font-semibold">
        <AlertTriangle size={16} />
        Weak Areas Detected
      </div>
      <div className="flex flex-col gap-2">
        {weak.map(([chapterId, acc]) => (
          <div key={chapterId} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-text-primary text-sm">{toLabel(chapterId)}</p>
              <p className="text-xs text-danger">{acc}% accuracy</p>
            </div>
            <Link
              href={`/notes?chapter=${chapterId}`}
              className="flex items-center gap-1 text-xs text-text-secondary border border-border rounded-lg px-2 py-1.5 hover:border-text-secondary transition-colors shrink-0 min-h-[44px]"
            >
              Revise <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
