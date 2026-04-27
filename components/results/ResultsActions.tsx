"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Home, RefreshCcw, FileText } from "lucide-react"

type Props = {
  testId: string
}

export function ResultsActions({ testId }: Props) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={`/test/${testId}/review`}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-surface text-text-primary font-semibold text-sm hover:bg-surface-2 transition-colors min-h-[44px]"
      >
        <BookOpen size={16} />
        Review Questions
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push("/test/build")}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-surface text-text-secondary text-sm hover:border-text-secondary transition-colors min-h-[44px]"
        >
          <RefreshCcw size={14} />
          New Test
        </button>

        <button
          type="button"
          onClick={() => {}}
          disabled
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-surface text-text-secondary text-sm opacity-40 min-h-[44px]"
          title="PDF export — coming in Sprint 6"
        >
          <FileText size={14} />
          Export PDF
        </button>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-background font-bold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
      >
        <Home size={16} />
        Dashboard
      </Link>
    </div>
  )
}
