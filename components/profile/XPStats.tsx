"use client"

import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import type { PlainUserProfile } from "@/types/student"

type Props = {
  profile: PlainUserProfile
}

export function XPStats({ profile }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-[28px] bg-surface">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span className="font-medium">XP Progress</span>
        <span className="text-text-primary">{(profile.xp_total ?? 0).toLocaleString()} total</span>
      </div>
      <XPProgressBar xp={profile.xp_total ?? 0} />
      <div className="flex justify-between items-center bg-background rounded-full px-4 py-3 mt-2">
        <span className="text-xs font-medium text-text-secondary">Earned this week</span>
        <span className="text-sm font-semibold text-accent">
          +{(profile.xp_this_week ?? 0).toLocaleString()} XP
        </span>
      </div>
    </div>
  )
}
