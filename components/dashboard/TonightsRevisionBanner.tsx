"use client"

import Link from "next/link"
import { Moon, ArrowRight, CheckCircle2 } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { toISTDateString } from "@/lib/dateUtils"

export function TonightsRevisionBanner() {
  const { profile } = useUserProfile()

  if (!profile) return null

  // It's evening if it's 6 PM or later
  const hour = new Date().getHours()
  const isEvening = hour >= 18

  if (!isEvening) return null

  // Check if revision has been done today by comparing last_revision_date
  const todayKey = toISTDateString()
  const hasCompletedRevision = profile.last_revision_date === todayKey

  if (hasCompletedRevision) {
    return (
      <div className="relative w-full rounded-[28px] overflow-hidden bg-accent/5 border border-accent/15 p-6 sm:p-7 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">Tonight's Revision Complete! 🎉</h3>
          <p className="text-sm text-text-secondary mt-0.5">Great work. Your revision session for today is done.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden bg-violet/10 border border-violet/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="relative flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center text-violet shrink-0">
          <Moon size={22} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Tonight&apos;s Revision</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-md">
            Review the concepts you struggled with recently — a short session before bed locks them in.
          </p>
        </div>
      </div>

      <Link
        href="/revision"
        className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-violet text-white font-semibold hover:bg-violet/80 transition-all group"
      >
        Start Revision
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Decorative */}
      <div className="absolute right-0 top-0 w-[400px] h-full bg-gradient-to-l from-violet/10 to-transparent pointer-events-none" />
      <div className="absolute right-10 -top-10 w-40 h-40 bg-violet/20 blur-[60px] pointer-events-none rounded-full" />
    </div>
  )
}
