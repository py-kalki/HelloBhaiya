"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipForward } from "lucide-react"
import { completePomodoroSession } from "@/actions/completePomodoroSession"

type Phase = "WORK" | "SHORT_BREAK" | "LONG_BREAK"

const PHASE_DURATION: Record<Phase, number> = {
  WORK:        25 * 60,
  SHORT_BREAK: 5  * 60,
  LONG_BREAK:  15 * 60,
}

const PHASE_LABELS: Record<Phase, string> = {
  WORK:        "Focus",
  SHORT_BREAK: "Short Break",
  LONG_BREAK:  "Long Break",
}

const SIZE = 200
const STROKE = 10
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

interface Props {
  taskId: string | null
  taskLabel: string
}

export function PomodoroTimer({ taskId, taskLabel }: Props) {
  const [phase, setPhase]           = useState<Phase>("WORK")
  const [seconds, setSeconds]       = useState(PHASE_DURATION["WORK"])
  const [running, setRunning]       = useState(false)
  const [sessions, setSessions]     = useState(0)
  const [xpFlash, setXpFlash]       = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = PHASE_DURATION[phase]
  const pct   = seconds / total
  const dash  = CIRC * pct
  const gap   = CIRC - dash

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")

  const completeSession = useCallback(async () => {
    const nextSessions = sessions + 1
    setSessions(nextSessions)

    await completePomodoroSession(taskId)
    setXpFlash(true)
    setTimeout(() => setXpFlash(false), 2000)

    const nextPhase: Phase =
      nextSessions % 4 === 0 ? "LONG_BREAK" : "SHORT_BREAK"
    setPhase(nextPhase)
    setSeconds(PHASE_DURATION[nextPhase])
    setRunning(false)
  }, [sessions, taskId])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          completeSession()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, completeSession])

  function skip() {
    setRunning(false)
    if (phase === "WORK") {
      completeSession()
    } else {
      setPhase("WORK")
      setSeconds(PHASE_DURATION["WORK"])
    }
  }

  const phaseColor =
    phase === "WORK" ? "#E0E0E0" : phase === "SHORT_BREAK" ? "#90D4A8" : "#7EB8E0"

  return (
    <div className="flex flex-col items-center gap-6">
      {taskLabel && (
        <p className="text-sm text-text-secondary text-center max-w-xs">{taskLabel}</p>
      )}

      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="#272729" strokeWidth={STROKE} />
          <circle
            cx={SIZE/2} cy={SIZE/2} r={R}
            fill="none"
            stroke={phaseColor}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-4xl font-bold text-text-primary font-mono">{mm}:{ss}</span>
          <span className="text-xs text-text-secondary">{PHASE_LABELS[phase]}</span>
          {sessions > 0 && (
            <span className="text-xs text-text-secondary mt-1">Session {sessions + 1}</span>
          )}
        </div>
      </div>

      {xpFlash && (
        <div className="text-success font-bold text-sm animate-bounce">+30 XP!</div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setRunning((v) => !v)}
          className="w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {running ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
        </button>
        <button
          onClick={skip}
          className="w-10 h-10 rounded-full bg-surface-2 border border-border text-text-secondary flex items-center justify-center hover:text-text-primary transition-colors"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < sessions % 4 ? "bg-success" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
