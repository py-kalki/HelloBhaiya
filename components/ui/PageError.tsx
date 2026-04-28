"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export function PageError({ error, reset }: Props) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
        <AlertTriangle size={22} className="text-danger" />
      </div>
      <div>
        <p className="text-text-primary font-semibold">Something went wrong</p>
        <p className="text-xs text-text-secondary mt-1">{error.message || "An unexpected error occurred."}</p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text-primary min-h-[44px]"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  )
}
