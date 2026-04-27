"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export function TonightsRevisionBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only after 6 PM IST (IST = UTC+5:30)
    const checkTime = () => {
      const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      setVisible(nowIST.getUTCHours() >= 18)
    }
    checkTime()
    const id = setInterval(checkTime, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <Link
      href="/revision"
      className="flex items-center justify-between gap-3 p-4 rounded-xl border border-warning/40 bg-warning/5 hover:bg-warning/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-warning" />
        </div>
        <div>
          <p className="text-text-primary font-semibold text-sm">Tonight&apos;s Revision Ready</p>
          <p className="text-text-secondary text-xs mt-0.5">5 chapters to review before sleep</p>
        </div>
      </div>
      <span className="text-warning text-sm shrink-0">→</span>
    </Link>
  )
}
