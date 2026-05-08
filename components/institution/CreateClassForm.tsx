"use client"

import { useState, useTransition } from "react"
import { Plus, X } from "lucide-react"
import { createClass } from "@/actions/createClass"

interface Props {
  institutionId: string
}

export function CreateClassForm({ institutionId }: Props) {
  const [open,       setOpen]       = useState(false)
  const [className,  setClassName]  = useState("")
  const [error,      setError]      = useState("")
  const [isPending,  startTransition] = useTransition()

  function handleSubmit() {
    if (!className.trim()) { setError("Class name is required."); return }
    setError("")
    startTransition(async () => {
      const result = await createClass({ institutionId, className })
      if (result.ok) {
        setOpen(false)
        setClassName("")
      } else {
        setError("Failed to create class. Please try again.")
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-sm font-bold rounded-xl min-h-[44px]"
      >
        <Plus size={16} />
        New Class
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-text-primary font-bold">New Class</h2>
          <button
            onClick={() => { setOpen(false); setClassName(""); setError("") }}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. NEET 2026 Batch A"
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          autoFocus
        />

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-3 bg-accent text-background font-bold rounded-xl text-sm disabled:opacity-50 min-h-[44px]"
        >
          {isPending ? "Creating…" : "Create Class"}
        </button>
      </div>
    </div>
  )
}
