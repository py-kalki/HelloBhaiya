"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

const CONFETTI_COLORS = ["#90D4A8", "#E0C078", "#E0E0E0", "#E09090", "#888888"]

type Particle = {
  id: number
  x: number
  y: number
  color: string
  size: number
  vx: number
  vy: number
  opacity: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 40,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
    size: 6 + Math.random() * 6,
    vx: (Math.random() - 0.5) * 8,
    vy: -(4 + Math.random() * 6),
    opacity: 1,
  }))
}

export function CompletionAnimation() {
  const router = useRouter()
  const [count, setCount] = useState(0)
  const [particles, setParticles] = useState<Particle[]>(() => generateParticles(60))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // XP counter animation
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(200 * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    // Redirect after animation
    const timer = setTimeout(() => router.push("/dashboard"), 2800)
    return () => clearTimeout(timer)
  }, [router])

  useEffect(() => {
    let frame = 0

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.4,
            y: p.y + p.vy * 0.4 + frame * 0.02,
            vy: p.vy + 0.15,
            opacity: Math.max(0, p.opacity - 0.012),
          }))
          .filter((p) => p.opacity > 0),
      )
      frame++
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 min-h-[320px] overflow-hidden select-none">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: `rotate(${p.x * 3}deg)`,
            }}
          />
        ))}
      </div>

      {/* Trophy */}
      <div className="text-6xl animate-bounce">🏆</div>

      {/* XP counter */}
      <div className="text-center">
        <p className="text-text-secondary text-sm font-medium mb-1">
          Welcome bonus
        </p>
        <p className="text-5xl font-bold text-success">
          +{count} XP
        </p>
      </div>

      <div className="text-center">
        <p className="text-xl font-bold text-text-primary">You&apos;re all set!</p>
        <p className="text-text-secondary text-sm mt-1">
          Taking you to your dashboard…
        </p>
      </div>
    </div>
  )
}
