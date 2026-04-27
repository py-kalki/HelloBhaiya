"use client"

import { useState } from "react"
import Link from "next/link"
import { RefreshCw, Target, CheckCircle2, ArrowRight } from "lucide-react"
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
    try { await refreshMicroGoal() }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't refresh goal") }
    finally { setRefreshing(false) }
  }

  async function handleGenerate() {
    setRefreshing(true)
    setError(null)
    try { await generateMicroGoal() }
    catch { setError("Couldn't generate goal") }
    finally { setRefreshing(false) }
  }

  if (loading) {
    return <div className="h-36 rounded-2xl shimmer" />
  }

  if (!goal) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Target size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-text-primary font-semibold text-sm">No goal yet</p>
            <p className="text-text-muted text-xs">Generate your daily mission</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={refreshing}
          className="h-10 px-4 rounded-xl bg-accent text-background text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-90 self-start"
        >
          {refreshing ? "Generating…" : "✨ Generate Goal"}
        </button>
      </div>
    )
  }

  const pct = goal.target > 0 ? Math.round((goal.done / goal.target) * 100) : 0
  const refreshesLeft = 2 - (goal.refreshes_used ?? 0)
  const isComplete = goal.complete

  return (
    <div className={`relative bg-surface border rounded-2xl p-5 flex flex-col gap-4 overflow-hidden animate-slide-up transition-all duration-300 ${
      isComplete ? "border-success/30 shadow-[0_0_30px_rgba(110,231,183,0.08)]" : "border-border"
    }`}>
      {/* Gradient top accent */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${isComplete ? "bg-gradient-to-r from-success/0 via-success to-success/0" : "bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0"}`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? "bg-success/12 border border-success/20" : "bg-accent/10 border border-accent/20"}`}>
            {isComplete
              ? <CheckCircle2 size={17} className="text-success" />
              : <Target size={17} className="text-accent" />
            }
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest">Today&apos;s Goal</p>
            <p className="text-text-primary font-semibold text-sm leading-snug">{goal.text}</p>
          </div>
        </div>

        {!isComplete && (
          <button
            onClick={handleRefresh}
            disabled={refreshing || refreshesLeft <= 0}
            title={refreshesLeft <= 0 ? "No refreshes left" : `${refreshesLeft} left`}
            className="shrink-0 p-2 rounded-xl border border-border text-text-muted hover:text-text-primary hover:bg-surface-2 disabled:opacity-25 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">
            <span className="text-text-primary font-bold font-mono">{goal.done}</span>
            <span className="text-text-muted"> / {goal.target} questions</span>
          </span>
          <span className={`font-bold font-mono ${isComplete ? "text-success" : "text-accent"}`}>
            {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isComplete ? "bg-gradient-to-r from-success to-emerald-400" : "bg-gradient-to-r from-accent to-violet-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Footer action */}
      {isComplete ? (
        <div className="flex items-center gap-2 text-success text-xs font-semibold">
          <CheckCircle2 size={14} />
          Goal complete! +150 XP earned 🎉
        </div>
      ) : (
        <Link
          href={`/test/build?chapter=${goal.chapter_id}`}
          className="self-start inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-surface-2 border border-border text-text-primary text-xs font-semibold hover:bg-border hover:border-text-muted transition-all group"
        >
          Continue
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}
