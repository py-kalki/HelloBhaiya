"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Sparkles } from "lucide-react"

export function TonightsRevisionBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => {
      const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      setVisible(nowIST.getUTCHours() >= 18)
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <Link
      href="/revision"
      className="group relative flex items-center justify-between gap-3 p-4 rounded-2xl border border-warning/25 overflow-hidden hover:border-warning/40 transition-all duration-300 animate-slide-up"
      style={{ background: "linear-gradient(135deg, rgba(252,211,77,0.06) 0%, rgba(245,158,11,0.03) 100%)" }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(ellipse at left, rgba(252,211,77,0.06) 0%, transparent 70%)" }} />

      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.2)" }}>
          <BookOpen size={18} className="text-warning" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-text-primary font-semibold text-sm">Tonight&apos;s Revision Ready</p>
            <Sparkles size={12} className="text-warning" />
          </div>
          <p className="text-text-muted text-xs mt-0.5">5 weak chapters · No timer · +150 XP</p>
        </div>
      </div>

      <div className="relative flex items-center gap-1 text-warning text-sm font-semibold shrink-0">
        Start
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </Link>
  )
}
