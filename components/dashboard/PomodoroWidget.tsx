"use client"

import { useState, useEffect, useTransition } from "react"
import { Play, Pause, RotateCcw, Timer, Loader2 } from "lucide-react"
import { completePomodoroSession } from "@/actions/completePomodoroSession"

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isPending) {
      if (mode === "focus") {
        setMode("break")
        setTimeLeft(5 * 60)
        setIsActive(false)
        // Call backend to award XP
        startTransition(async () => {
          try {
            await completePomodoroSession(null)
          } catch (e) {
            console.error("Failed to complete pomodoro:", e)
          }
        })
      } else {
        setMode("focus")
        setTimeLeft(25 * 60)
        setIsActive(false)
      }
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft, mode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    if (mode === "focus") {
      setTimeLeft(25 * 60)
    } else {
      setTimeLeft(5 * 60)
    }
  }

  const switchMode = (newMode: "focus" | "break") => {
    setMode(newMode)
    setIsActive(false)
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progress = mode === "focus" 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Timer size={16} className="text-accent" />
          </div>
          <span className="text-sm font-medium text-white">
            Focus Timer
            {isPending && <Loader2 size={12} className="inline ml-2 animate-spin text-accent" />}
          </span>
        </div>
        
        <div className="flex bg-surface-2 p-1 rounded-full text-xs font-medium border border-white/5">
          <button 
            onClick={() => switchMode("focus")}
            className={`px-3 py-1 rounded-full transition-colors ${mode === "focus" ? "bg-accent text-black" : "text-text-secondary hover:text-white"}`}
          >
            Focus
          </button>
          <button 
            onClick={() => switchMode("break")}
            className={`px-3 py-1 rounded-full transition-colors ${mode === "break" ? "bg-white text-black" : "text-text-secondary hover:text-white"}`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative py-4">
        {/* Progress Ring Background */}
        <svg className="w-48 h-48 transform -rotate-90 absolute">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-surface-2 fill-none"
            strokeWidth="4"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className={`fill-none transition-all duration-1000 ease-linear ${mode === "focus" ? "stroke-accent" : "stroke-white"}`}
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        <span className="text-5xl font-medium text-white tracking-tight tabular-nums relative z-10">
          {formatTime(timeLeft)}
        </span>
        <span className="text-sm text-text-secondary mt-2 relative z-10">
          {mode === "focus" ? "Time to study" : "Take a breather"}
        </span>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button 
          onClick={toggleTimer}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
            isActive 
              ? "bg-surface-2 text-white border border-white/10" 
              : "bg-accent text-black"
          }`}
        >
          {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-2 text-text-secondary border border-white/5 hover:text-white hover:bg-white/5 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}
