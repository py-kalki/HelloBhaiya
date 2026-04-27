"use client"

import Image from "next/image"
import { LevelBadge } from "@/components/gamification/LevelBadge"
import type { PlainUserProfile } from "@/types/student"

const EXAM_LABELS: Record<string, string> = {
  NEET: "NEET", JEE_MAINS: "JEE Mains", JEE_ADV: "JEE Advanced", OTHER: "Other",
}

export function IdentityCard({ profile }: { profile: PlainUserProfile }) {
  const examLabel = EXAM_LABELS[profile.exam] ?? "Other"

  return (
    <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0" />

      {/* Avatar */}
      <div className="relative shrink-0">
        {profile.photo_url ? (
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-violet-600/20 blur-sm scale-105" />
            <Image
              src={profile.photo_url}
              alt={profile.name}
              width={64} height={64}
              className="relative w-16 h-16 rounded-full border-2 border-accent/20 object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-violet-600/15 border-2 border-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
            {profile.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="relative flex-1 min-w-0">
        <p className="text-text-primary font-bold text-base truncate">{profile.name}</p>
        <p className="text-text-muted text-xs truncate mt-0.5">{profile.email}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-accent/25 bg-accent/10 text-accent font-medium">
            {examLabel}
          </span>
        </div>
      </div>

      {/* Level badge */}
      <div className="relative shrink-0">
        <LevelBadge xp={profile.xp_total ?? 0} size="md" />
      </div>
    </div>
  )
}
