"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase/client"
import { doc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore"
import { auth } from "@/lib/firebase/client"
import { onAuthStateChanged } from "firebase/auth"
import { useTestStore } from "@/stores/testStore"
import { OptionsList } from "@/components/test/taking/OptionsList"
import { TimerRing } from "@/components/test/taking/TimerRing"
import { submitTest } from "@/actions/submitTest"
import type { Question, TestSession } from "@/types/question"
import { Pause, Play, Send, Flag, FlagOff } from "lucide-react"

// Subject pill colours
const SUBJ_META: Record<string, { label: string; color: string; bg: string }> = {
  Physics:   { label: "PHY",  color: "#60a5fa", bg: "rgba(96,165,250,0.15)"  },
  Chemistry: { label: "CHEM", color: "#34d399", bg: "rgba(52,211,153,0.15)"  },
  Botany:    { label: "BOT",  color: "#fbbf24", bg: "rgba(251,191,36,0.15)"  },
  Zoology:   { label: "ZOO",  color: "#f472b6", bg: "rgba(244,114,182,0.15)" },
}

function subjMeta(subject?: string) {
  return SUBJ_META[subject ?? ""] ?? { label: (subject ?? "—").slice(0, 4).toUpperCase(), color: "#A1A1AA", bg: "rgba(161,161,170,0.1)" }
}

function formatMath(text: string): string {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, "<span class='math-block'>\\[$1\\]</span>")
    .replace(/\$([\s\S]+?)\$/g, "<span class='math-inline'>\\($1\\)</span>")
}

export default function TestTakePage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()

  const store = useTestStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [restoredToast, setRestoredToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const totalTimerSeconds = useRef<number | null>(null)

  const loadTest = useCallback(async (uid: string) => {
    try {
      const testRef = doc(db, "users", uid, "tests", testId)
      const testSnap = await getDoc(testRef)
      if (!testSnap.exists()) {
        setError("Test not found.")
        setLoading(false)
        return
      }

      const testSession = testSnap.data() as TestSession
      if (testSession.status === "COMPLETED") {
        router.replace(`/test/${testId}/results`)
        return
      }

      const storedTestId = store.testId
      const isRestoring = storedTestId === testId && store.status === "active"

      // Fetch questions in batches of 10
      const questionIds = testSession.questions
      const allQuestions: Question[] = []
      for (let i = 0; i < questionIds.length; i += 10) {
        const batch = questionIds.slice(i, i + 10)
        const q = query(collection(db, "questions"), where(documentId(), "in", batch))
        const snap = await getDocs(q)
        const batchDocs = snap.docs.map((d) => ({ ...d.data(), question_id: d.id }) as Question)
        const ordered = batch.map((id) => batchDocs.find((q) => q.question_id === id)!).filter(Boolean)
        allQuestions.push(...ordered)
      }
      setQuestions(allQuestions)

      if (!isRestoring) {
        const timerSeconds = testSession.config.timer_minutes ? testSession.config.timer_minutes * 60 : null
        totalTimerSeconds.current = timerSeconds
        store.initTest(testId, allQuestions, timerSeconds)
      } else {
        totalTimerSeconds.current = store.timeRemainingSeconds
        setRestoredToast(true)
        setTimeout(() => setRestoredToast(false), 3000)
      }
      startTimeRef.current = Date.now()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error("[loadTest]", msg)
      setError(`Failed to load test: ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [testId, router, store])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { router.replace("/login"); return }
      loadTest(user.uid)
    })
    return unsub
  }, [loadTest, router])

  // Timer tick
  const storeStatus = store.status
  const hasTimer = store.timeRemainingSeconds !== null
  const storeTick = store.tick
  useEffect(() => {
    if (storeStatus !== "active" || !hasTimer) return
    timerRef.current = setInterval(() => { storeTick() }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [storeStatus, hasTimer, storeTick])

  // Auto-submit on timer = 0
  const timeRemaining = store.timeRemainingSeconds
  useEffect(() => {
    if (timeRemaining === 0 && storeStatus === "active") void handleSubmit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  const currentQuestion = questions[store.currentIndex]
  const answeredCount = Object.keys(store.answers).length

  async function handleSubmit(autoSubmit = false) {
    if (!autoSubmit && !showSubmitConfirm) { setShowSubmitConfirm(true); return }
    setShowSubmitConfirm(false)
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    try {
      await submitTest({ testId, answers: store.answers, flagged: store.flagged, timeTakenSeconds: timeTaken, pausesUsed: store.pausesUsed })
      store.reset()
      router.push(`/test/${testId}/results`)
    } catch {
      setError("Submission failed. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-text-secondary text-sm">Loading test...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-dvh p-4">
        <p className="text-danger text-center text-sm">{error}</p>
      </div>
    )
  }

  if (!currentQuestion) return null

  const timerTotal = totalTimerSeconds.current ?? store.timeRemainingSeconds ?? 0
  const meta = subjMeta(currentQuestion.subject)

  return (
    <div className="min-h-dvh flex flex-col bg-background">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0 gap-3 flex-wrap">
        {/* Left: subject pill + Q counter */}
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md"
            style={{ color: meta.color, background: meta.bg }}
          >
            {meta.label}
          </span>
          <span className="text-sm text-text-secondary">
            Q <b className="text-text-primary">{store.currentIndex + 1}</b> / {questions.length}
          </span>
        </div>

        {/* Right: timer + pause + submit */}
        <div className="flex items-center gap-2">
          {store.timeRemainingSeconds !== null && (
            <>
              <TimerRing
                totalSeconds={timerTotal}
                remainingSeconds={store.timeRemainingSeconds}
                isPaused={store.isPaused}
              />
              <button
                type="button"
                onClick={() => store.isPaused ? store.resume() : store.pause()}
                disabled={!store.isPaused && store.pausesUsed >= 2}
                className="flex items-center gap-1 text-xs text-text-secondary border border-border rounded-lg px-2 py-1.5 min-h-[44px] min-w-[44px] justify-center disabled:opacity-40 hover:border-text-secondary transition-colors"
                title={store.pausesUsed >= 2 ? "No pauses left" : undefined}
              >
                {store.isPaused ? <Play size={14} /> : <Pause size={14} />}
                {!store.isPaused && <span className="ml-0.5 hidden sm:inline">{2 - store.pausesUsed} left</span>}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="flex items-center gap-1.5 text-xs bg-danger/10 text-danger border border-danger/30 font-semibold rounded-lg px-3 py-1.5 min-h-[44px] hover:bg-danger/20 transition-colors disabled:opacity-50"
          >
            <Send size={13} />
            <span className="hidden sm:inline">End Test</span>
          </button>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="px-4 pt-3 shrink-0">
        <div className="h-[3px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((store.currentIndex + 1) / questions.length) * 100)}%`,
              background: meta.color,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-text-secondary mt-1">
          <span>{answeredCount} answered</span>
          <span>{questions.length - answeredCount} remaining</span>
        </div>
      </div>

      {/* ── Dots row ── */}
      <div className="px-4 pt-3 shrink-0">
        <div className="flex gap-1 flex-wrap">
          {questions.map((q, i) => {
            const m = subjMeta(q.subject)
            const isCur = i === store.currentIndex
            const isDone = store.answers[q.question_id] !== undefined
            const isFlagged = store.flagged.includes(q.question_id)
            return (
              <button
                key={i}
                type="button"
                onClick={() => store.navigate(i)}
                title={`Q${i + 1}`}
                className="w-[18px] h-[18px] rounded-sm transition-all duration-150 hover:scale-125 relative"
                style={{
                  background: isCur
                    ? meta.color
                    : isFlagged
                    ? "var(--warning)"
                    : isDone
                    ? m.bg
                    : "var(--surface-2)",
                  outline: isCur ? `2px solid ${meta.color}` : "none",
                  outlineOffset: "1px",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ── Question card ── */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-border bg-surface p-5 mb-4 animate-rise-in">

          {/* Card header: big serif number + topic tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="font-display text-xl font-bold text-text-secondary leading-none">
              {String(store.currentIndex + 1).padStart(2, "0")}
            </span>
            {currentQuestion.topic && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-border text-text-secondary">
                {currentQuestion.topic}
              </span>
            )}
            {currentQuestion.type === "NUMERICAL" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 border border-warning/30 text-warning font-semibold tracking-wide">
                NUMERICAL
              </span>
            )}
            {currentQuestion.is_pyq && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 border border-violet/30 text-violet font-semibold tracking-wide">
                PYQ {currentQuestion.pyq_year ?? ""}
              </span>
            )}
            {/* Flag button */}
            <button
              type="button"
              onClick={() => store.toggleFlag(currentQuestion.question_id)}
              className="ml-auto min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors"
            >
              {store.flagged.includes(currentQuestion.question_id) ? (
                <Flag size={16} className="text-warning" />
              ) : (
                <FlagOff size={16} className="text-text-secondary" />
              )}
            </button>
          </div>

          {/* Question text */}
          <div
            className="font-display text-base leading-relaxed text-text-primary mb-5"
            dangerouslySetInnerHTML={{ __html: formatMath(currentQuestion.question_text) }}
          />

          {/* Options */}
          <OptionsList
            question={currentQuestion}
            answer={store.answers[currentQuestion.question_id]}
            onAnswer={(a) => store.setAnswer(currentQuestion.question_id, a)}
            disabled={store.isPaused || submitting}
          />

          {/* Unanswered note */}
          {store.answers[currentQuestion.question_id] === undefined && (
            <p className="text-xs text-text-secondary mt-3">Not yet answered</p>
          )}
        </div>

        {/* ── Nav buttons ── */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => store.navigate(store.currentIndex - 1)}
            disabled={store.currentIndex === 0}
            className="flex items-center gap-1.5 text-sm text-text-secondary border border-border rounded-xl px-4 py-2.5 min-h-[44px] hover:border-text-secondary transition-colors disabled:opacity-30"
          >
            ← Prev
          </button>

          {/* Skip (only mid-test) */}
          {store.currentIndex < questions.length - 1 && (
            <button
              type="button"
              onClick={() => store.navigate(store.currentIndex + 1)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors min-h-[44px] px-2"
            >
              Skip
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (store.currentIndex < questions.length - 1) {
                store.navigate(store.currentIndex + 1)
              } else {
                handleSubmit(false)
              }
            }}
            disabled={submitting}
            className="flex items-center gap-1.5 text-sm font-bold rounded-xl px-5 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{
              background: meta.color,
              color: "#000",
            }}
          >
            {store.currentIndex < questions.length - 1 ? "Next →" : `Finish ✓`}
          </button>
        </div>
      </main>

      {/* ── Pause overlay ── */}
      {store.isPaused && (
        <div className="absolute inset-0 z-30 bg-background/95 flex flex-col items-center justify-center gap-4">
          <p className="text-text-primary font-semibold text-lg">Test Paused</p>
          <p className="text-text-secondary text-sm">Questions hidden during pause</p>
          <button
            type="button"
            onClick={() => store.resume()}
            className="flex items-center gap-2 bg-accent text-background font-bold rounded-xl px-6 py-3 min-h-[44px]"
          >
            <Play size={18} /> Resume
          </button>
        </div>
      )}

      {/* ── Restored toast ── */}
      {restoredToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-surface border border-success/40 text-success text-xs px-4 py-2 rounded-xl shadow-lg">
          Session restored — continue where you left off
        </div>
      )}

      {/* ── Submit confirmation modal ── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-text-primary font-semibold text-lg">Submit Test?</h2>
            <div className="text-sm text-text-secondary flex flex-col gap-1.5">
              <p>Answered: <span className="text-text-primary font-bold">{answeredCount}</span> / {questions.length}</p>
              <p>Unattempted: <span className="text-warning font-bold">{questions.length - answeredCount}</span></p>
              {store.flagged.length > 0 && (
                <p>Flagged: <span className="text-warning font-bold">{store.flagged.length}</span></p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 border border-border text-text-secondary rounded-xl py-3 text-sm font-semibold hover:border-text-secondary transition-colors min-h-[44px]"
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 bg-accent text-background rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
              >
                {submitting ? "Submitting..." : "Confirm Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
