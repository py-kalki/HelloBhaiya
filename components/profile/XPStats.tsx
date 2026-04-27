"use client"

import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import type { UserProfile } from "@/types/student"

type Props = {
  profile: UserProfile
}

export function XPStats({ profile }: Props) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span className="font-semibold uppercase tracking-wider">XP Progress</span>
        <span className="font-mono text-text-primary">{(profile.xp_total ?? 0).toLocaleString()} total</span>
      </div>
      <XPProgressBar xp={profile.xp_total ?? 0} />
      <div className="text-xs text-text-secondary flex justify-between border-t border-border pt-2 mt-1">
        <span>This week</span>
        <span className="font-mono text-warning font-semibold">
          +{(profile.xp_this_week ?? 0).toLocaleString()} XP
        </span>
      </div>
    </div>
  )
}
