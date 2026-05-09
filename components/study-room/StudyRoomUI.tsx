"use client"

import { useState, useEffect, useRef } from "react"
import { Video, Mic, MicOff, VideoOff, MonitorUp, PhoneOff, Users, MessageSquare } from "lucide-react"

export function StudyRoomUI({ roomCode }: { roomCode: string }) {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Attempt to get user media for a real feel
    async function getMedia() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(userStream)
        if (videoRef.current) {
          videoRef.current.srcObject = userStream
        }
      } catch (err) {
        console.error("Failed to get media", err)
      }
    }
    if (isVideoOn) {
      getMedia()
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isVideoOn])

  // Mock participants
  const participants = [
    { id: 1, name: "Rahul (Host)", role: "host", avatar: "R" },
    { id: 2, name: "Aarav", role: "participant", avatar: "A" },
    { id: 3, name: "Priya", role: "participant", avatar: "P" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4 md:p-6 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Video size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Live Study Session</h1>
            <p className="text-sm text-text-secondary">Room Code: <span className="font-mono text-accent select-all">{roomCode}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-2 border border-white/5 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            02:45:12
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Video Grid */}
        <div className="flex-1 bg-surface border border-white/5 rounded-2xl overflow-hidden relative flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-2 p-2">
            {/* Local Video */}
            <div className="relative bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group">
              {isVideoOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-violet/20 flex items-center justify-center text-3xl font-bold text-violet">
                  You
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2">
                You
                {!isMicOn && <MicOff size={14} className="text-red-400" />}
              </div>
            </div>

            {/* Remote Videos (Mocked) */}
            {participants.slice(1).map((p) => (
              <div key={p.id} className="relative bg-surface-2 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-surface border border-white/10 flex items-center justify-center text-3xl font-bold text-text-secondary">
                  {p.avatar}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium text-white">
                  {p.name}
                </div>
              </div>
            ))}
            
            {/* Add placeholder for 4th grid item to keep it symmetrical */}
            <div className="relative bg-surface/50 rounded-xl border border-white/5 border-dashed flex flex-col items-center justify-center text-text-muted gap-2">
              <Users size={24} />
              <span className="text-sm font-medium">Waiting for others...</span>
              <span className="text-xs">Share code: {roomCode}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 bg-background/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-4 px-6">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-surface-2 text-white hover:bg-white/10' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-surface-2 text-white hover:bg-white/10' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button className="w-12 h-12 rounded-full bg-surface-2 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
              <MonitorUp size={20} />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button className="px-6 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2 transition-colors">
              <PhoneOff size={20} />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Sidebar (Chat & Participants) */}
        <div className="w-80 bg-surface border border-white/5 rounded-2xl flex flex-col hidden lg:flex">
          <div className="flex items-center gap-4 border-b border-white/5 p-4">
            <button className="flex-1 pb-2 border-b-2 border-accent text-accent font-medium text-sm">
              Chat
            </button>
            <button className="flex-1 pb-2 border-b-2 border-transparent text-text-muted hover:text-white font-medium text-sm transition-colors">
              Participants ({participants.length})
            </button>
          </div>
          
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {/* Mock Chat Messages */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted font-medium">Aarav • 10:42 AM</span>
              <p className="text-sm text-white bg-surface-2 p-3 rounded-2xl rounded-tl-sm w-fit max-w-[90%] border border-white/5">
                Hey! Can we solve the HC Verma problems from chapter 4?
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[11px] text-text-muted font-medium">You • 10:43 AM</span>
              <p className="text-sm text-black bg-accent p-3 rounded-2xl rounded-tr-sm w-fit max-w-[90%]">
                Sure, let me open the PDF. Give me a sec.
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-surface-2 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 transition-colors">
                <MessageSquare size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
