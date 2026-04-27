"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { generateRevisionSet } from "@/actions/generateRevisionSet"
import { BookOpen, Zap } from "lucide-react"

export default function RevisionPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleStart() {
    setError("")
    startTransition(async () => {
      try {
        const testId = await generateRevisionSet()
        router.push(`/test/${testId}/take`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate revision set.")
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4 max-w-sm mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center">
        <BookOpen size={28} className="text-warning" />
      </div>

      <div>
        <h1 className="text-text-primary font-bold text-xl">Tonight&apos;s Revision</h1>
        <p className="text-text-secondary text-sm mt-2">
          5 targeted questions from your weakest chapters — no timer, just understanding.
        </p>
      </div>

      {error && (
        <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 w-full">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isPending}
        className="flex items-center gap-2 bg-warning text-background font-bold px-8 py-4 rounded-2xl text-base hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px] w-full justify-center"
      >
        <Zap size={20} />
        {isPending ? "Preparing..." : "Start Revision"}
      </button>

      <p className="text-xs text-text-secondary">
        Completing tonight&apos;s revision earns +150 XP
      </p>
    </div>
  )
}
