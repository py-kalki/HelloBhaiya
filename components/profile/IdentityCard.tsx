"use client"

import { useState } from "react"
import Image from "next/image"
import { LevelBadge } from "@/components/gamification/LevelBadge"
import type { PlainUserProfile } from "@/types/student"
import { Pencil, MapPin, CalendarDays, Code2, Flame, Zap } from "lucide-react"
import { EditProfileModal } from "./EditProfileModal"

const EXAM_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  NEET:      { bg: "#D4FF59",  text: "#000",    glow: "#D4FF5940" },
  JEE_MAINS: { bg: "#60A5FA", text: "#000",    glow: "#60A5FA40" },
  JEE_ADV:   { bg: "#A78BFA", text: "#000",    glow: "#A78BFA40" },
  OTHER:     { bg: "#94A3B8", text: "#000",    glow: "#94A3B840" },
}

export function IdentityCard({ profile }: { profile: PlainUserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const examStyle = EXAM_COLORS[profile.exam] ?? EXAM_COLORS.OTHER!
  const joinDate = new Date(profile.created_at || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <>
      <div className="relative flex flex-col rounded-[28px] bg-surface overflow-hidden border border-white/6 shadow-2xl">

        {/* ── Banner with animated gradient ── */}
        <div className="relative h-36 sm:h-52 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />
          {/* grid lines overlay */}
          <div className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "48px 48px"
            }}
          />
          {/* glow orbs */}
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: examStyle.bg }} />
          <div className="absolute -bottom-8 right-16 w-32 h-32 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "#A78BFA" }} />

          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3.5 py-2 flex items-center gap-2 rounded-full text-white text-sm font-medium hover:bg-white/15 transition-colors z-10"
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-8 relative flex flex-col sm:flex-row gap-6 sm:gap-8">

          {/* Avatar */}
          <div className="relative -mt-16 sm:-mt-20 shrink-0">
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 overflow-hidden shadow-xl"
              style={{ borderColor: examStyle.bg }}
            >
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt={profile.name} fill className="object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-5xl font-black"
                  style={{ background: `linear-gradient(135deg, ${examStyle.bg}60, #0A0A0B)`, color: examStyle.bg }}
                >
                  {profile.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* exam badge */}
            <div
              className="absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-xs font-black border-2 shadow-lg"
              style={{
                backgroundColor: examStyle.bg,
                color: examStyle.text,
                borderColor: "#0A0A0B",
                boxShadow: `0 0 16px ${examStyle.glow}`
              }}
            >
              {profile.exam === "JEE_MAINS" ? "JEE" : profile.exam === "JEE_ADV" ? "JEE ADV" : profile.exam}
            </div>
          </div>

          {/* User info */}
          <div className="flex-1 pt-2 sm:pt-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight truncate">
                  {profile.name}
                </h2>
                <p className="text-text-muted text-sm mt-0.5 truncate">{profile.email}</p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                  <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin size={14} style={{ color: examStyle.bg }} />
                    {profile.city || "Earth"}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <CalendarDays size={14} className="text-blue-400" />
                    Joined {joinDate}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Code2 size={14} className="text-violet" />
                    <span className="font-mono text-white text-xs">{profile.invite_code || "XXXX"}</span>
                  </span>
                </div>

                {/* quick stats pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/20 text-xs font-semibold text-orange-400">
                    <Flame size={12} />
                    {profile.streak_current ?? 0}d streak
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
                    <Zap size={12} />
                    {(profile.xp_total ?? 0).toLocaleString()} XP
                  </div>
                </div>
              </div>

              <div className="flex shrink-0">
                <LevelBadge xp={profile.xp_total ?? 0} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          initialName={profile.name}
          initialPhotoUrl={profile.photo_url || ""}
          initialCity={profile.city || ""}
          initialExam={profile.exam || "NEET"}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  )
}
