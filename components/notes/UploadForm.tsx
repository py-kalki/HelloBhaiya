"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import { uploadNote } from "@/actions/uploadNote"
import { getSyllabus, type SubjectChapter } from "@/lib/syllabusData"

const SUBJECTS = ["Biology", "Physics", "Chemistry", "Mathematics"] as const
type Subject = (typeof SUBJECTS)[number]

const NEET_SYLLABUS_MAP = Object.fromEntries(
  getSyllabus("NEET").map((s) => [s.name, s.chapters])
) as Record<string, SubjectChapter[]>

interface Props {
  userLevel: number
  creatorName: string
  creatorHandle: string
}

const MIN_LEVEL = 15

export function UploadForm({ userLevel, creatorName, creatorHandle }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title,     setTitle]    = useState("")
  const [subject,   setSubject]  = useState<Subject>("Biology")
  const [chapterId, setChapterId] = useState("")
  const [noteType,  setNoteType] = useState<"HANDWRITTEN" | "TYPED">("TYPED")
  const [pdfB64,    setPdfB64]   = useState<string | null>(null)
  const [fileName,  setFileName] = useState<string | null>(null)
  const [error,     setError]    = useState("")
  const [success,   setSuccess]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const chapters: SubjectChapter[] = NEET_SYLLABUS_MAP[subject] ?? []

  if (userLevel < MIN_LEVEL) {
    return (
      <div className="bg-surface-2 border border-border rounded-2xl p-6 text-center space-y-3">
        <AlertCircle size={32} className="text-warning mx-auto" />
        <p className="text-text-primary font-semibold">Level 15 Required</p>
        <p className="text-sm text-text-secondary">
          Reach Scholar level to unlock community note uploads. You&apos;re at Level {userLevel}.
        </p>
      </div>
    )
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") { setError("Only PDF files are allowed."); return }
    if (file.size > 20 * 1024 * 1024) { setError("File must be under 20 MB."); return }
    setError("")
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setPdfB64(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function submit() {
    if (!title.trim() || !chapterId || !pdfB64) {
      setError("Please fill all fields and select a PDF.")
      return
    }
    setError("")
    startTransition(async () => {
      const result = await uploadNote({
        title,
        subject,
        chapter_id: chapterId,
        type: noteType,
        pdfBase64: pdfB64,
        creatorName,
        creatorHandle,
      })
      if (result.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/notes/${result.noteId}`), 1500)
      } else {
        setError(
          result.error === "LEVEL_TOO_LOW"   ? "Your level is too low to upload." :
          result.error === "INVALID_INPUT"   ? "Please check all fields." :
          "Upload failed. Please try again."
        )
      }
    })
  }

  if (success) {
    return (
      <div className="bg-surface-2 border border-border rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mx-auto">
          <Check size={22} className="text-success" />
        </div>
        <p className="text-text-primary font-semibold">Note uploaded!</p>
        <p className="text-sm text-text-secondary">Under review — you&apos;ll earn XP when it hits 10 views.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Note Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Cell Division — Complete Notes"
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
        />
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Subject</label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => { setSubject(s); setChapterId("") }}
              className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
                subject === s ? "bg-accent text-background" : "bg-surface-2 border border-border text-text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Chapter</label>
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="">Select chapter…</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Note Type</label>
        <div className="flex gap-2">
          {(["TYPED", "HANDWRITTEN"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setNoteType(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors min-h-[44px] border ${
                noteType === t ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2 text-text-secondary"
              }`}
            >
              {t === "TYPED" ? "Typed / Digital" : "Handwritten"}
            </button>
          ))}
        </div>
      </div>

      {/* PDF drop zone */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">PDF File (max 20 MB)</label>
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-border rounded-2xl text-text-secondary hover:border-accent transition-colors"
        >
          {fileName ? (
            <>
              <FileText size={24} className="text-accent" />
              <span className="text-xs text-accent font-medium">{fileName}</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm">Tap to select PDF</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        onClick={submit}
        disabled={isPending}
        className="w-full py-4 bg-accent text-background font-bold rounded-2xl text-sm disabled:opacity-50 min-h-[44px]"
      >
        {isPending ? "Uploading…" : "Submit for Review"}
      </button>

      <p className="text-xs text-text-secondary text-center">
        Notes are reviewed before going live. Earn +100 XP when your note hits 10 views.
      </p>
    </div>
  )
}
