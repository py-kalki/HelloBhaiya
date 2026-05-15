"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase/client"
import { doc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore"
import { auth } from "@/lib/firebase/client"
import { onAuthStateChanged } from "firebase/auth"
import { useTestStore } from "@/stores/testStore"
import { QuestionDisplay } from "@/components/test/taking/QuestionDisplay"
import { OptionsList } from "@/components/test/taking/OptionsList"
import { TimerRing } from "@/components/test/taking/TimerRing"
import { QuestionPalette } from "@/components/test/taking/QuestionPalette"
import { submitTest } from "@/actions/submitTest"
import type { Question, TestSession } from "@/types/question"
import { ChevronLeft, ChevronRight, LayoutGrid, Pause, Play, Send } from "lucide-react"

export default function TestTakePage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()

  const store = useTestStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPalette, setShowPalette] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [restoredToast, setRestoredToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const totalTimerSeconds = useRef<number | null>(null)

  const loadTest = useCallback(async (uid: string) => {
    try {
      // Load test session from Firestore
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

      // Check if restoring from persisted Zustand state
      const storedTestId = store.testId
      const isRestoring = storedTestId === testId && store.status === "active"

      // Fetch question documents in batches of 10 (Firestore `in` limit)
      const questionIds = testSession.questions
      const allQuestions: Question[] = []

      for (let i = 0; i < questionIds.length; i += 10) {
        const batch = questionIds.slice(i, i + 10)
        const q = query(
          collection(db, "questions"),
          where(documentId(), "in", batch),
        )
        const snap = await getDocs(q)
        const batchDocs = snap.docs.map((d) => ({ ...d.data(), question_id: d.id }) as Question)
        // Preserve order from testSession.questions
        const ordered = batch.map((id) => batchDocs.find((q) => q.question_id === id)!).filter(Boolean)
        allQuestions.push(...ordered)
      }

      setQuestions(allQuestions)

      if (!isRestoring) {
        const timerSeconds = testSession.config.timer_minutes
          ? testSession.config.timer_minutes * 60
          : null
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

  // Auth + load
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

  // Auto-submit on timer hit 0
  const timeRemaining = store.timeRemainingSeconds
  useEffect(() => {
    if (timeRemaining === 0 && storeStatus === "active") {
      void handleSubmit(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  const currentQuestion = questions[store.currentIndex]
  const answeredCount = Object.keys(store.answers).length

  async function handleSubmit(autoSubmit = false) {
    if (!autoSubmit && !showSubmitConfirm) {
      setShowSubmitConfirm(true)
      return
    }
    setShowSubmitConfirm(false)
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)

    try {
      await submitTest({
        testId,
        answers: store.answers,
        flagged: store.flagged,
        timeTakenSeconds: timeTaken,
        pausesUsed: store.pausesUsed,
      })
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
        <p className="text-danger text-center">{error}</p>
      </div>
    )
  }

  if (!currentQuestion) return null

  const timerTotal = totalTimerSeconds.current ?? store.timeRemainingSeconds ?? 0

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          {/* Timer */}
          {store.timeRemainingSeconds !== null ? (
            <TimerRing
              totalSeconds={timerTotal}
              remainingSeconds={store.timeRemainingSeconds}
              isPaused={store.isPaused}
            />
          ) : (
            <span className="text-xs text-text-secondary font-mono">No timer</span>
          )}
          {/* Pause button — max 2 pauses */}
          {store.timeRemainingSeconds !== null && (
            <button
              type="button"
              onClick={() => store.isPaused ? store.resume() : store.pause()}
              disabled={!store.isPaused && store.pausesUsed >= 2}
              className="flex items-center gap-1 text-xs text-text-secondary border border-border rounded-lg px-2 py-1.5 min-h-[44px] min-w-[44px] justify-center disabled:opacity-40 hover:border-text-secondary transition-colors"
              title={store.pausesUsed >= 2 ? "No pauses left" : undefined}
            >
              {store.isPaused ? <Play size={14} /> : <Pause size={14} />}
              {!store.isPaused && (
                <span className="ml-0.5">{2 - store.pausesUsed} left</span>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Palette toggle */}
          <button
            type="button"
            onClick={() => setShowPalette(true)}
            className="flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-lg px-3 py-1.5 min-h-[44px] hover:border-text-secondary transition-colors"
          >
            <LayoutGrid size={14} />
            <span>{answeredCount}/{questions.length}</span>
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="flex items-center gap-1.5 text-xs bg-accent text-background font-semibold rounded-lg px-3 py-1.5 min-h-[44px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={14} />
            Submit
          </button>
        </div>
      </header>

      {/* Pause overlay */}
      {store.isPaused && (
        <div className="absolute inset-0 z-30 bg-background/95 flex flex-col items-center justify-center gap-4">
          <p className="text-text-primary font-semibold text-lg">Test Paused</p>
          <p className="text-text-secondary text-sm">Questions hidden during pause</p>
          <button
            type="button"
            onClick={() => store.resume()}
            className="flex items-center gap-2 bg-accent text-background font-semibold rounded-xl px-6 py-3 min-h-[44px]"
          >
            <Play size={18} />
            Resume
          </button>
        </div>
      )}

      {/* Restored session toast */}
      {restoredToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-surface border border-success/40 text-success text-xs px-4 py-2 rounded-xl shadow-lg">
          Session restored — continue where you left off
        </div>
      )}

      {/* Main question area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <QuestionDisplay
          question={currentQuestion}
          index={store.currentIndex}
          total={questions.length}
          isFlagged={store.flagged.includes(currentQuestion.question_id)}
          onToggleFlag={() => store.toggleFlag(currentQuestion.question_id)}
        />

        <div className="mt-6">
          <OptionsList
            question={currentQuestion}
            answer={store.answers[currentQuestion.question_id]}
            onAnswer={(a) => store.setAnswer(currentQuestion.question_id, a)}
            disabled={store.isPaused || submitting}
          />
        </div>
      </main>

      {/* Bottom navigation */}
      <footer className="shrink-0 border-t border-border bg-surface px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => store.navigate(store.currentIndex - 1)}
          disabled={store.currentIndex === 0}
          className="flex items-center gap-1.5 text-sm text-text-secondary border border-border rounded-xl px-4 py-2.5 min-h-[44px] hover:border-text-secondary transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        {/* Skip button */}
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
          className="flex items-center gap-1.5 text-sm font-semibold bg-accent text-background rounded-xl px-4 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {store.currentIndex < questions.length - 1 ? (
            <>Next <ChevronRight size={16} /></>
          ) : (
            <>Submit <Send size={16} /></>
          )}
        </button>
      </footer>

      {/* Question Palette — mobile drawer, desktop sidebar */}
      {showPalette && (
        <div className="fixed inset-0 z-40 md:relative md:inset-auto">
          <div
            className="absolute inset-0 bg-background/60 md:hidden"
            onClick={() => setShowPalette(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[70vh] bg-surface border-t border-border rounded-t-2xl md:hidden overflow-hidden">
            <QuestionPalette
              questions={questions}
              answers={store.answers}
              flagged={store.flagged}
              currentIndex={store.currentIndex}
              onNavigate={store.navigate}
              onClose={() => setShowPalette(false)}
              answeredCount={answeredCount}
              totalCount={questions.length}
            />
          </div>
        </div>
      )}

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-text-primary font-semibold">Submit Test?</h2>
            <div className="text-sm text-text-secondary flex flex-col gap-1">
              <p>Answered: <span className="text-text-primary font-semibold">{answeredCount}</span> / {questions.length}</p>
              <p>Unattempted: <span className="text-warning font-semibold">{questions.length - answeredCount}</span></p>
              {store.flagged.length > 0 && (
                <p>Flagged: <span className="text-warning font-semibold">{store.flagged.length}</span></p>
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
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
