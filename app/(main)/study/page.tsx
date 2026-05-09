"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Video, UserPlus, Copy, CheckCircle2 } from "lucide-react"

export default function StudyLobbyPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")

  function handleCreateRoom() {
    // Generate a random 6-character alphanumeric room code
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    router.push(`/study/${newRoomCode}`)
  }

  function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!joinCode.trim()) return
    router.push(`/study/${joinCode.trim().toUpperCase()}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 max-w-lg mx-auto w-full">
      <div className="w-16 h-16 rounded-3xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(var(--accent),0.2)]">
        <Video size={32} className="text-accent" />
      </div>

      <h1 className="text-text-primary font-bold text-3xl mb-3 text-center tracking-tight">Co-Study Rooms</h1>
      <p className="text-text-secondary text-sm mb-10 text-center leading-relaxed">
        Study together with friends! Turn on your mic and camera to stay accountable, discuss doubts, and conquer the syllabus together.
      </p>

      <div className="w-full bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        
        {/* Create Room */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCreateRoom}
            className="w-full flex items-center justify-center gap-2 bg-accent text-background font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent),0.5)]"
          >
            <Video size={18} />
            Create a New Study Room
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-text-muted font-semibold uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Join Room */}
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest pl-1">Join an existing room</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room Code (e.g. ABCD12)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={12}
              className="flex-1 bg-background border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 text-sm font-mono tracking-wider"
            />
            <button
              type="submit"
              disabled={!joinCode.trim()}
              className="px-6 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <UserPlus size={16} />
              Join
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
