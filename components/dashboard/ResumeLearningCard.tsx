"use client"

import { Play, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export function ResumeLearningCard({ lastFocusModule }: { lastFocusModule?: any }) {
  if (!lastFocusModule) return null;

  const currentFocus = {
    subject: lastFocusModule.subject || "Physics",
    topic: lastFocusModule.topic || "Kinematics",
    type: lastFocusModule.type || "Video Lecture",
    progress: lastFocusModule.progress || 65,
    timeLeft: "Continue now",
    link: lastFocusModule.link || "/notes/physics/kinematics"
  }

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 relative overflow-hidden group">
      {/* Background glow based on subject color */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px] group-hover:bg-blue-500/30 transition-colors pointer-events-none" />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-0.5">Resume Learning</p>
              <h3 className="text-lg font-bold text-white leading-tight">{currentFocus.subject}</h3>
            </div>
          </div>
          <span className="text-xs font-medium text-text-muted bg-surface-2 px-3 py-1 rounded-full border border-white/5">
            {currentFocus.timeLeft}
          </span>
        </div>

        <div className="mt-auto">
          <p className="text-sm text-text-secondary mb-2">
            Currently on: <span className="text-white font-medium">{currentFocus.topic} ({currentFocus.type})</span>
          </p>

          <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${currentFocus.progress}%` }}
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-white/50" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={currentFocus.link}
              className="flex-1 bg-white text-black py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <Play size={16} className="fill-black" />
              <span>Continue Lesson</span>
            </Link>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-2 text-white border border-white/5 hover:border-white/20 transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
