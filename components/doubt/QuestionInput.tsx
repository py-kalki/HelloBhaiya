"use client"

import { useState, useRef, useTransition } from "react"
import Link from "next/link"
import { Camera, Send, X, BookOpen } from "lucide-react"
import { askDoubt, type AskDoubtResult } from "@/actions/askDoubt"
import { UsageCounter } from "./UsageCounter"
import { SolutionDisplay } from "./SolutionDisplay"

const SUBJECTS = ["Biology", "Physics", "Chemistry", "Mathematics", "Other"]

interface Props {
  initialUsed: number
  quota: number
}

export function QuestionInput({ initialUsed, quota }: Props) {
  const [question, setQuestion]   = useState("")
  const [subject, setSubject]     = useState("")
  const [imageB64, setImageB64]   = useState<string | null>(null)
  const [imagePreview, setPreview] = useState<string | null>(null)
  const [result, setResult]       = useState<AskDoubtResult | null>(null)
  const [used, setUsed]           = useState(initialUsed)
  const [, startTransition]       = useTransition()
  const [loading, setLoading]     = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setPreview(dataUrl)
      const b64 = dataUrl.split(",")[1] ?? null
      setImageB64(b64)
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImageB64(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function submit() {
    if (!question.trim() && !imageB64) return
    setLoading(true)
    startTransition(async () => {
      const res = await askDoubt(question, subject, imageB64)
      setResult(res)
      if (res.ok) {
        setUsed(res.usedToday)
        setQuestion("")
        removeImage()
      }
      setLoading(false)
    })
  }

  return (
    <div className="space-y-4">
      <UsageCounter used={used} quota={quota} />

      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSubject("")}
            className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
              subject === "" ? "bg-accent text-background" : "bg-surface-2 border border-border text-text-secondary"
            }`}
          >
            Any Subject
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
                subject === s ? "bg-accent text-background" : "bg-surface-2 border border-border text-text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {imagePreview && (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Question" className="max-h-48 rounded-xl border border-border" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-text-primary" />
            </button>
          </div>
        )}

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question or doubt here… (LaTeX supported: $x^2 + y^2$)"
            rows={4}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-3 bg-surface-2 border border-border rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
          >
            <Camera size={16} />
            Photo
          </button>
          <button
            onClick={submit}
            disabled={loading || used >= quota || (!question.trim() && !imageB64)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-background text-sm font-bold rounded-xl disabled:opacity-40 min-h-[44px]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                Ask
              </>
            )}
          </button>
        </div>
      </div>

      {result && !result.ok && result.error === "QUOTA_EXCEEDED" && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl">
          <p className="text-sm text-danger font-medium">Daily limit reached</p>
          <p className="text-xs text-text-secondary mt-1">You&apos;ve used all {quota} free questions today. Come back tomorrow!</p>
        </div>
      )}
      {result && !result.ok && result.error === "API_ERROR" && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl">
          <p className="text-sm text-danger font-medium">Something went wrong</p>
          <p className="text-xs text-text-secondary mt-1">Please try again.</p>
        </div>
      )}
      {result?.ok && (
        <SolutionDisplay solution={result.solution} subject={subject} />
      )}

      {used >= quota && (
        <div className="flex items-center gap-2 p-3 bg-surface-2 border border-border rounded-xl">
          <BookOpen size={14} className="text-text-secondary shrink-0" />
          <p className="text-xs text-text-secondary">
            While you wait, check the <Link href="/notes" className="text-accent underline">Notes Library</Link> for answers.
          </p>
        </div>
      )}
    </div>
  )
}
