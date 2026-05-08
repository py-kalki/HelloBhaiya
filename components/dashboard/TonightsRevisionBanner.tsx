"use client"

import Link from "next/link"
import { Moon, ArrowRight } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

export function TonightsRevisionBanner() {
  const { profile } = useUserProfile()
  
  if (!profile) return null

  const hour = new Date().getHours()
  const isEvening = hour >= 18

  if (!isEvening) return null

  // If revision is already completed today, hide banner
  // For Phase 1, we simulate this by checking if they earned any revision XP today
  const hasCompletedRevision = false 

  if (hasCompletedRevision) return null

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden bg-violet/10 border border-violet/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="relative flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center text-violet shrink-0">
          <Moon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Tonight&apos;s Revision</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-md">
            Review 5 concepts you struggled with recently before heading to bed.
          </p>
        </div>
      </div>
      
      <Link 
        href="/revision"
        className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-violet text-white font-semibold hover:bg-violet-dim transition-all group"
      >
        Start Revision
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Decorative background effects */}
      <div className="absolute right-0 top-0 w-[400px] h-full bg-gradient-to-l from-violet/10 to-transparent pointer-events-none" />
      <div className="absolute right-10 -top-10 w-40 h-40 bg-violet/20 blur-[60px] pointer-events-none rounded-full" />
    </div>
  )
}
