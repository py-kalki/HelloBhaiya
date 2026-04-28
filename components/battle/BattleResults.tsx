"use client"

import Link from "next/link"
import { Trophy, Target, Clock, Zap, Home, RotateCcw } from "lucide-react"
import type { BattleSummary } from "@/types/battle"

interface Props {
  summary: BattleSummary
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  )
}

export function BattleResults({ summary }: Props) {
  const won = summary.winnerUid === summary.myUid
  const drew = summary.winnerUid === null

  const xpEarned = won ? 250 : 75
  const myAcc    = summary.myAccuracy ?? 0
  const oppAcc   = summary.oppAccuracy ?? 0
  const myTime   = summary.myTimeSeconds
  const oppTime  = summary.oppTimeSeconds

  function fmtTime(s: number | null): string {
    if (s === null) return "—"
    return `${Math.floor(s / 60)}m ${s % 60}s`
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-8 pb-24 flex flex-col items-center gap-6 text-center">
      {/* Outcome banner */}
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
        won  ? "bg-success/15 border border-success/30" :
        drew ? "bg-warning/15 border border-warning/30" :
               "bg-danger/15  border border-danger/30"
      }`}>
        <Trophy size={36} className={won ? "text-success" : drew ? "text-warning" : "text-text-secondary"} />
      </div>

      <div>
        <h1 className={`text-2xl font-bold ${won ? "text-success" : drew ? "text-warning" : "text-danger"}`}>
          {won ? "Victory!" : drew ? "Draw" : "Defeated"}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {won  ? "You outperformed your opponent" :
           drew ? "You tied on accuracy and speed" :
                  "Better luck next time, keep grinding"}
        </p>
      </div>

      {/* XP earned */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-surface-2 border border-border rounded-full">
        <Zap size={14} className="text-warning" />
        <span className="text-sm font-bold text-text-primary">+{xpEarned} XP</span>
      </div>

      {/* Stats grid */}
      <div className="w-full space-y-2">
        <p className="text-xs text-text-secondary uppercase tracking-wide font-medium">Results</p>
        <div className="grid grid-cols-2 gap-2">
          <StatCell label="My Accuracy" value={`${myAcc}%`} />
          <StatCell label="Opponent"    value={`${oppAcc}%`} />
          <StatCell
            label="My Time"
            value={fmtTime(myTime)}
          />
          <StatCell
            label="Opp Time"
            value={fmtTime(oppTime)}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full bg-surface-2 border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-text-secondary" />
            <span className="text-text-secondary">Accuracy edge</span>
          </div>
          <span className={`font-semibold ${myAcc >= oppAcc ? "text-success" : "text-danger"}`}>
            {myAcc >= oppAcc ? "+" : ""}{myAcc - oppAcc}%
          </span>
        </div>
        {myTime !== null && oppTime !== null && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-secondary" />
              <span className="text-text-secondary">Speed edge</span>
            </div>
            <span className={`font-semibold ${myTime <= oppTime ? "text-success" : "text-danger"}`}>
              {myTime <= oppTime ? "Faster" : "Slower"} by {Math.abs(myTime - oppTime)}s
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <Link
          href="/battle"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-danger text-background font-bold rounded-xl text-sm min-h-[44px]"
        >
          <RotateCcw size={15} />
          Battle Again
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 bg-surface-2 border border-border rounded-xl text-sm text-text-secondary min-h-[44px]"
        >
          <Home size={14} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
