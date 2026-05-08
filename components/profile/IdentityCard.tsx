"use client"

import { useState } from "react"
import Image from "next/image"
import { LevelBadge } from "@/components/gamification/LevelBadge"
import type { PlainUserProfile } from "@/types/student"
import { Pencil } from "lucide-react"
import { EditProfileModal } from "./EditProfileModal"

const EXAM_LABELS: Record<string, string> = {
  NEET: "NEET", JEE_MAINS: "JEE Mains", JEE_ADV: "JEE Advanced", OTHER: "Other",
}

export function IdentityCard({ profile }: { profile: PlainUserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const examLabel = EXAM_LABELS[profile.exam] ?? "Other"

  return (
    <>
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[28px] bg-surface overflow-hidden group">
        {/* Edit Button */}
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors z-10 sm:opacity-0 sm:group-hover:opacity-100"
          title="Edit Profile"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profile.photo_url ? (
            <div className="relative w-20 h-20">
              <Image
                src={profile.photo_url}
                alt={profile.name}
                width={80} height={80}
                className="relative w-20 h-20 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center text-3xl font-bold text-violet">
              {profile.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
          {/* Exam Tag overlaying avatar slightly */}
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-accent text-black text-xs font-bold border-2 border-surface">
            {examLabel}
          </div>
        </div>

        {/* Info */}
        <div className="relative flex-1 min-w-0">
          <p className="text-text-primary font-medium text-2xl truncate tracking-tight">{profile.name}</p>
          <p className="text-text-muted text-sm truncate mt-1">{profile.email}</p>
        </div>
      </div>

      {/* Level badge */}
      <div className="relative shrink-0 sm:self-center pr-4 sm:pr-8">
        <LevelBadge xp={profile.xp_total ?? 0} size="lg" />
      </div>
    </div>

    {isEditing && (
      <EditProfileModal 
        initialName={profile.name} 
        initialPhotoUrl={profile.photo_url || ""} 
        onClose={() => setIsEditing(false)} 
      />
    )}
    </>
  )
}
