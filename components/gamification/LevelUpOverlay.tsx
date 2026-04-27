"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

type Props = {
  newLevel: number
  newTitle: string
  newUnlock: string
  onDismiss: () => void
}

export function LevelUpOverlay({ newLevel, newTitle, newUnlock, onDismiss }: Props) {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 1.5 + Math.random() * 1.5,
      size: 4 + Math.random() * 8,
      color: ["#90D4A8", "#E0C078", "#E0E0E0", "#E09090"][Math.floor(Math.random() * 4)]!,
    })),
  )

  const [levelVisible, setLevelVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLevelVisible(true), 200)
    const t2 = setTimeout(() => setTitleVisible(true), 700)
    const t3 = setTimeout(() => onDismiss(), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDismiss])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onDismiss}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: "-10px",
              width: p.size,
              height: p.size,
              background: p.color,
              animation: `fall ${p.duration}s ${p.delay}s ease-in forwards`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Content */}
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center">
          <Star size={36} className="text-warning" />
        </div>

        <p className="text-text-secondary text-sm">LEVEL UP!</p>

        <div
          className="transition-all duration-500"
          style={{
            opacity: levelVisible ? 1 : 0,
            transform: levelVisible ? "scale(1)" : "scale(0.7)",
          }}
        >
          <span className="text-7xl font-bold text-text-primary font-mono">{newLevel}</span>
        </div>

        <div
          className="transition-all duration-500"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <p className="text-2xl font-bold text-accent">{newTitle}</p>
          <p className="text-sm text-text-secondary mt-1">Unlocked: {newUnlock}</p>
        </div>

        <p className="text-xs text-text-secondary mt-4">Tap anywhere to continue</p>
      </div>
    </div>
  )
}
