"use client"

import { useState, useEffect } from "react"
import { Star, X } from "lucide-react"
import { rateNote } from "@/actions/rateNote"

interface Props {
  noteId: string
  delayMs?: number
}

export function RatingPrompt({ noteId, delayMs = 30000 }: Props) {
  const [visible, setVisible]   = useState(false)
  const [selected, setSelected] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const key = `rated-${noteId}`
    if (localStorage.getItem(key)) return
    const t = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(t)
  }, [noteId, delayMs])

  async function submit() {
    if (selected === 0) return
    await rateNote(noteId, selected)
    localStorage.setItem(`rated-${noteId}`, "1")
    setSubmitted(true)
    setTimeout(() => setVisible(false), 1500)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
      <div className="bg-surface-2 border border-border rounded-2xl p-4 shadow-2xl">
        {submitted ? (
          <p className="text-sm text-success text-center font-medium">Thanks for rating!</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-text-primary">Rate this note</p>
              <button
                onClick={() => setVisible(false)}
                className="text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Star
                    size={28}
                    className={
                      i <= selected
                        ? "text-warning fill-warning"
                        : "text-border hover:text-warning transition-colors"
                    }
                  />
                </button>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={selected === 0}
              className="w-full py-2.5 rounded-xl bg-accent text-background text-sm font-medium disabled:opacity-40 transition-opacity min-h-[44px]"
            >
              Submit Rating
            </button>
          </>
        )}
      </div>
    </div>
  )
}
