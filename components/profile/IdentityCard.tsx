"use client"

import Image from "next/image"
import { LevelBadge } from "@/components/gamification/LevelBadge"
import type { UserProfile } from "@/types/student"

type Props = {
  profile: UserProfile
}

export function IdentityCard({ profile }: Props) {
  const examLabel =
    profile.exam === "NEET"
      ? "NEET"
      : profile.exam === "JEE_MAINS"
        ? "JEE Mains"
        : profile.exam === "JEE_ADV"
          ? "JEE Advanced"
          : "Other"

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface">
      {profile.photo_url ? (
        <Image
          src={profile.photo_url}
          alt={profile.name}
          width={64}
          height={64}
          className="rounded-full border border-border shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0 text-xl font-bold text-text-primary">
          {profile.name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-semibold truncate">{profile.name}</p>
        <p className="text-text-secondary text-xs truncate">{profile.email}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs px-2 py-0.5 rounded-full border border-accent/30 bg-accent/10 text-accent">
            {examLabel}
          </span>
        </div>
      </div>

      <LevelBadge xp={profile.xp_total ?? 0} size="md" />
    </div>
  )
}
