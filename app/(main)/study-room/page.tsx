"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Video, Key, Plus } from "lucide-react"

export default function StudyRoomLobbyPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")

  const handleCreateRoom = () => {
    // Generate a random 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    router.push(`/study-room/${code}`)
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (joinCode.trim().length > 0) {
      router.push(`/study-room/${joinCode.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 max-w-3xl mx-auto w-full text-center">
      <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center mb-8 mx-auto rotate-3 shadow-[0_0_30px_rgba(203,247,69,0.2)]">
        <Video size={40} className="text-accent -rotate-3" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
        Study Together <br className="md:hidden" /> <span className="text-accent">Live</span>
      </h1>
      <p className="text-text-secondary text-lg max-w-xl mx-auto mb-12">
        Create a private room to study with friends, share your screen, and stay accountable with live camera sessions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Create Room */}
        <div className="bg-surface border border-white/5 rounded-[28px] p-8 flex flex-col items-center text-center hover:border-white/10 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">New Session</h3>
          <p className="text-sm text-text-muted mb-8">Start an instant meeting and invite your friends</p>
          <button 
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-2xl bg-accent text-black font-bold text-lg hover:bg-[#cbf745] transition-colors mt-auto"
          >
            Create Room
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-surface border border-white/5 rounded-[28px] p-8 flex flex-col items-center text-center hover:border-white/10 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Key size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Join Session</h3>
          <p className="text-sm text-text-muted mb-8">Enter a room code provided by your friend</p>
          <form onSubmit={handleJoinRoom} className="w-full flex gap-2 mt-auto">
            <input 
              type="text" 
              placeholder="e.g. A8X9P2"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 bg-surface-2 border border-white/10 rounded-2xl px-4 text-center font-mono text-lg text-white uppercase placeholder:normal-case placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              maxLength={8}
            />
            <button 
              type="submit"
              disabled={joinCode.trim().length === 0}
              className="px-6 rounded-2xl bg-white text-black font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
