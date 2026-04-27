"use client"

import { useState, useTransition } from "react"
import { X, Save } from "lucide-react"
import { saveTemplate } from "@/actions/saveTemplate"
import type { TestConfig } from "@/types/question"

type Props = {
  config: TestConfig
  onClose: () => void
  onSaved: () => void
}

export function SaveTemplateModal({ config, onClose, onSaved }: Props) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!name.trim()) {
      setError("Please enter a template name.")
      return
    }
    setError("")
    startTransition(async () => {
      try {
        await saveTemplate(name.trim(), config)
        onSaved()
        onClose()
      } catch {
        setError("Failed to save template. Please try again.")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-text-primary font-semibold">Save Template</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          autoFocus
          placeholder="e.g. NEET Physics Weak Chapters"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent"
        />

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-background font-semibold text-sm transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? "Saving..." : "Save Template"}
        </button>
      </div>
    </div>
  )
}
