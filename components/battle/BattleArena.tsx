"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { doc, onSnapshot } from "firebase/firestore"
import { db as clientDb } from "@/lib/firebase/client"
import { submitBattleAnswers } from "@/actions/submitBattleAnswers"
import type { Question } from "@/types/question"
import type { Battle } from "@/types/battle"
import { Swords, Zap, Flag, Clock } from "lucide-react"

interface Props {
  battleId:    string
  isPlayer1:   boolean
  questions:   Question[]
  initialData: Battle
}

const TOTAL_SECONDS = 5 * 60  // 5 min total timer

export function BattleArena({ battleId, isPlayer1, questions, initialData }: Props) {
  const router    = useRouter()
  const [battle,  setBattle]    = useState<Battle>(initialData)
  const [answers, setAnswers]   = useState<Record<string, string | number>>({})
  const [current, setCurrent]   = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_SECONDS)
  // eslint-disable-next-line react-hooks/purity
  const startedAt = useRef(Date.now())

  const oppKey = isPlayer1 ? "player2" : "player1"
  const oppProgress: number = (battle as Record<string, unknown>)[`${oppKey}_progress`] as number ?? 0
  const oppDone = Boolean((battle as Record<string, unknown>)[`${oppKey}_accuracy`])

  // Real-time battle updates
  useEffect(() => {
    const ref = doc(clientDb, "battles", battleId)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setBattle(snap.data() as Battle)
    })
    return unsub
  }, [battleId])

  // Redirect to results when battle completes
  useEffect(() => {
    if (battle.status === "COMPLETED") {
      router.replace(`/battle?id=${battleId}&done=1`)
    }
  }, [battle.status, battleId, router])

  // Countdown timer
  useEffect(() => {
    if (submitted) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    setSubmitted(true)
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000)
    try {
      await submitBattleAnswers(battleId, answers, timeTaken)
    } catch {
      setSubmitted(false)
    }
  }, [submitted, battleId, answers])

  const q   = questions[current]!
  const mm  = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss  = String(timeLeft % 60).padStart(2, "0")
  const myProgress = Math.round((Object.keys(answers).length / questions.length) * 100)

  function select(answer: string) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [q.question_id]: answer }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-danger" />
          <span className="text-sm font-bold text-text-primary">Battle</span>
          <span className="text-xs text-text-secondary ml-1">Q{current + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-warning">
          <Clock size={14} />
          {mm}:{ss}
        </div>
      </div>

      {/* Opponent progress */}
      <div className="bg-surface-2 border border-border rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Zap size={11} />
            Opponent
          </span>
          <span>{oppDone ? "Submitted!" : `${oppProgress}% done`}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="h-2 rounded-full bg-danger transition-all duration-500"
            style={{ width: `${oppProgress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface-2 border border-border rounded-2xl p-4">
        <p className="text-xs text-text-secondary mb-2 font-medium">{q.subject} · {q.chapter}</p>
        <p className="text-sm text-text-primary leading-relaxed">{q.question_text}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {(q.options as string[]).map((opt, i) => {
          const label = String.fromCharCode(65 + i)
          const isSelected = answers[q.question_id] === label
          return (
            <button
              key={i}
              onClick={() => select(label)}
              disabled={submitted}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors min-h-[44px] ${
                isSelected
                  ? "border-accent bg-accent/10 text-text-primary"
                  : "border-border bg-surface-2 text-text-primary hover:border-text-secondary"
              }`}
            >
              <span className={`font-mono font-bold shrink-0 ${isSelected ? "text-accent" : "text-text-secondary"}`}>
                {label}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-3 bg-surface-2 border border-border rounded-xl text-sm text-text-secondary disabled:opacity-30 min-h-[44px]"
        >
          Back
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="flex-1 py-3 bg-accent text-background font-bold rounded-xl text-sm min-h-[44px]"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-danger text-background font-bold rounded-xl text-sm disabled:opacity-50 min-h-[44px]"
          >
            <Flag size={15} />
            {submitted ? "Submitted…" : "Submit Battle"}
          </button>
        )}
      </div>

      {/* My progress bar */}
      <div className="space-y-1">
        <p className="text-xs text-text-secondary">My progress: {myProgress}%</p>
        <div className="w-full bg-surface rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-success transition-all"
            style={{ width: `${myProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
