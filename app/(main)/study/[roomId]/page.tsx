"use client"

import { use, useState } from "react"
import { JitsiMeeting } from "@jitsi/react-sdk"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react"

export default function StudyRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter()
  const { profile } = useUserProfile()
  const { roomId } = use(params)
  
  const [copied, setCopied] = useState(false)

  function handleCopyCode() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate a unique room name specific to HelloBhaiya so it doesn't clash with public Jitsi rooms
  const jitsiRoomName = `HelloBhaiya-StudyRoom-${roomId}`

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] w-full">
      {/* Top Header for the room */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/study")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white">Co-Study Room</h1>
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-background border border-white/10 rounded-full px-1.5 py-1.5">
          <span className="text-xs font-mono font-bold text-accent px-3 tracking-widest">{roomId}</span>
          <button
            onClick={handleCopyCode}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
            title="Copy Invite Code"
          >
            {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Jitsi Meeting Container */}
      <div className="flex-1 bg-black relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={jitsiRoomName}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: profile?.name || "Student",
            email: profile?.email || "",
          }}
          onApiReady={(externalApi) => {
            // Optional: attach listeners to externalApi if needed
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%'
            iframeRef.style.width = '100%'
          }}
        />
      </div>
    </div>
  )
}
