"use client"

import { useState } from "react"
import Image from "next/image"
import { LevelBadge } from "@/components/gamification/LevelBadge"
import type { PlainUserProfile } from "@/types/student"
import { Pencil, MapPin, CalendarDays, Code2 } from "lucide-react"
import { EditProfileModal } from "./EditProfileModal"

const EXAM_LABELS: Record<string, string> = {
  NEET: "NEET", JEE_MAINS: "JEE Mains", JEE_ADV: "JEE Advanced", OTHER: "Other",
}

export function IdentityCard({ profile }: { profile: PlainUserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const examLabel = EXAM_LABELS[profile.exam] ?? "Other"

  // Derive a join date string
  const joinDate = new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <>
      <div className="relative flex flex-col rounded-[32px] bg-surface overflow-hidden group shadow-2xl border border-white/5">
        
        {/* Banner Cover */}
        <div className="h-32 sm:h-48 w-full bg-gradient-to-br from-violet/40 via-accent/20 to-surface-2 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 flex items-center gap-2 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors z-10"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-8 relative flex flex-col sm:flex-row gap-6 sm:gap-10">
          
          {/* Avatar Area */}
          <div className="relative -mt-16 sm:-mt-20 shrink-0">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] border-4 border-surface bg-background overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-violet to-accent/50 flex items-center justify-center text-5xl font-bold text-white">
                  {profile.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-3 -right-3 px-4 py-1.5 rounded-full bg-accent text-black text-sm font-bold border-[3px] border-surface shadow-lg transform -rotate-6">
              {examLabel}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 pt-2 sm:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">{profile.name}</h2>
                <p className="text-text-muted text-base">{profile.email}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-5">
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin size={16} className="text-accent" />
                    <span>{profile.city || "Earth"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <CalendarDays size={16} className="text-blue-400" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Code2 size={16} className="text-violet" />
                    <span>Code: <span className="font-mono text-white">{profile.invite_code || "XXXX"}</span></span>
                  </div>
                </div>
              </div>

              {/* Level Badge aligned top right on desktop */}
              <div className="mt-4 sm:mt-0 flex shrink-0">
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
