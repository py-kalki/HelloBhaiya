"use client"

import { useState } from "react"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { useDailyGoal } from "@/lib/hooks/useDailyGoal"
import { refreshMicroGoal } from "@/actions/refreshMicroGoal"
import { generateMicroGoal } from "@/actions/generateMicroGoal"

export function MicroGoalCard() {
  const { goal, loading } = useDailyGoal()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRefresh() {
    if (refreshing) return
    setRefreshing(true)
    setError(null)
    try {
      await refreshMicroGoal()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't refresh goal")
    } finally {
      setRefreshing(false)
    }
  }

  async function handleGenerate() {
    setRefreshing(true)
    setError(null)
    try {
      await generateMicroGoal()
    } catch {
      setError("Couldn't generate goal")
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return <div className="h-28 rounded-xl bg-surface-2 animate-pulse" />
  }

  if (!goal) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
        <p className="text-text-secondary text-sm">No goal for today yet.</p>
        <button
          onClick={handleGenerate}
          disabled={refreshing}
          className="h-10 px-4 rounded-lg bg-accent text-background text-sm font-semibold disabled:opacity-50 self-start"
        >
          {refreshing ? "Generating…" : "Generate Goal"}
        </button>
      </div>
    )
  }

  const pct = goal.target > 0 ? Math.round((goal.done / goal.target) * 100) : 0
  const refreshesLeft = 2 - (goal.refreshes_used ?? 0)

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-widest">
            Today&apos;s Goal
          </p>
          <p className="text-text-primary font-semibold text-sm leading-snug">{goal.text}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || refreshesLeft <= 0}
          title={refreshesLeft <= 0 ? "No refreshes left" : `${refreshesLeft} refresh${refreshesLeft === 1 ? "" : "es"} left`}
          className="shrink-0 p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-2 disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-xs">
            {goal.done} / {goal.target} questions
          </span>
          <span className="text-xs font-semibold text-success">+150 XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-success transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {goal.complete ? (
        <p className="text-success text-xs font-semibold">✓ Goal complete!</p>
      ) : (
        <Link
          href={`/test/build?chapter=${goal.chapter_id}`}
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-surface-2 border border-border text-text-primary text-sm font-medium hover:bg-border transition-colors self-start"
        >
          Continue →
        </Link>
      )}

      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}
