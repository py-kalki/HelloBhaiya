"use client"

import Link from "next/link"
import { Compass, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background p-6 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-24 h-24 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative">
          <div className="absolute inset-0 rounded-full border-t border-accent/40 animate-spin-slow" />
          <Compass size={40} className="text-accent" />
        </div>

        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-text-primary mb-3">Lost in the Syllabus?</h2>
        <p className="text-text-secondary text-sm mb-10 leading-relaxed">
          We can't seem to find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <Link 
          href="/dashboard"
          className="flex items-center gap-2 bg-accent text-background font-bold text-sm px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(212,255,89,0.3)] hover:shadow-[0_0_30px_rgba(212,255,89,0.5)]"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
