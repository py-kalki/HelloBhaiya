"use client"

import { useState } from "react"
import Link from "next/link"
import { RefreshCw, Target, CheckCircle2, ArrowRight, MoreHorizontal } from "lucide-react"
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
    return <div className="h-full min-h-[300px] rounded-[28px] bg-surface animate-pulse" />
  }

  if (!goal) {
    return (
      <div className="relative h-full min-h-[300px] bg-surface rounded-[28px] p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">Daily Mission</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4">
          <div>
            <p className="text-text-primary font-medium text-lg">No mission active</p>
            <p className="text-text-muted text-sm mt-1">Ready to tackle your weak areas?</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={refreshing}
            className="self-start px-6 py-3 rounded-full bg-accent text-black text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90 active:scale-95"
          >
            {refreshing ? "Generating..." : "Generate Goal"}
          </button>
        </div>
      </div>
    )
  }

  const pct = goal.target > 0 ? Math.round((goal.done / goal.target) * 100) : 0
  const refreshesLeft = 2 - (goal.refreshes_used ?? 0)
  const isComplete = goal.complete

  return (
    <div className="relative h-full bg-surface rounded-[28px] p-6 flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {isComplete ? <CheckCircle2 size={18} className="text-accent" /> : <Target size={18} className="text-text-secondary" />}
          <span className="text-sm font-medium text-text-secondary">Daily Mission</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mock Pill Tabs for aesthetic */}
          <div className="hidden sm:flex items-center bg-background rounded-full p-1 border border-border">
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-text-muted">Math</button>
            <button className="px-4 py-1.5 rounded-full bg-accent text-black text-xs font-semibold">Science</button>
          </div>
          <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-text-primary hover:bg-surface-2 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Title */}
        <div className="mb-8">
          <p className="text-2xl font-medium leading-snug text-text-primary">{goal.text}</p>
        </div>

        {/* Progress Graphic */}
        <div className="relative flex flex-col gap-3 mt-auto">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-text-primary font-medium text-3xl">{goal.done}</span>
              <span className="text-text-muted text-sm">/ {goal.target}</span>
            </div>
            <span className={`text-sm font-medium ${isComplete ? "text-accent" : "text-violet"}`}>
              {pct}%
            </span>
          </div>
          
          {/* Custom segmented progress bar to match the chart vibe */}
          <div className="h-4 w-full flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const fillPct = i * 10
              const isFilled = pct > fillPct
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-sm ${isFilled ? (isComplete ? 'bg-accent' : 'bg-violet') : 'bg-surface-2'}`}
                  style={{ opacity: isFilled ? 1 : 0.5 }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        {isComplete ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <CheckCircle2 size={16} />
            Mission complete! +150 XP
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <Link
              href={`/test/build?chapter=${goal.chapter_id}`}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Continue
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing || refreshesLeft <= 0}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white disabled:opacity-30 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="absolute bottom-2 left-6 text-danger text-xs">{error}</p>}
    </div>
  )
}
