"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Route Error Caught:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background p-6 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-danger/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-24 h-24 rounded-full bg-surface-2 border border-danger/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(248,113,113,0.15)] relative">
          <AlertTriangle size={40} className="text-danger" />
        </div>

        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Oops! Something went wrong.</h1>
        <p className="text-text-secondary text-sm mb-10 leading-relaxed">
          We encountered an issue loading this section. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface text-white border border-white/10 font-bold text-sm px-8 py-4 rounded-2xl hover:bg-white/5 transition-colors"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-background font-bold text-sm px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
