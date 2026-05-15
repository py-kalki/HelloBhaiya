"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db, auth } from "@/lib/firebase/client"
import { doc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { QuestionReviewCard } from "@/components/results/QuestionReviewCard"
import type { Question, TestSession } from "@/types/question"
import { ArrowLeft, CheckCircle2, XCircle, Minus } from "lucide-react"
import Link from "next/link"

const LABELS = ["A", "B", "C", "D"]
function resolveAnswer(answer: string | number | undefined, options: string[]): string | number | undefined {
  if (answer === undefined || answer === null || answer === "") return answer
  const idx = LABELS.indexOf(String(answer))
  return idx !== -1 && options[idx] !== undefined ? options[idx] : answer
}

type FilterMode = "all" | "wrong" | "correct" | "unattempted"

export default function ReviewPage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [session, setSession] = useState<TestSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterMode>("all")
  const [error, setError] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return }

      try {
        const testRef = doc(db, "users", user.uid, "tests", testId)
        const testSnap = await getDoc(testRef)
        if (!testSnap.exists()) { setError("Test not found."); setLoading(false); return }

        const sess = testSnap.data() as TestSession
        setSession(sess)

        // Fetch questions in batches of 10
        const questionIds = sess.questions ?? []
        const allQuestions: Question[] = []

        for (let i = 0; i < questionIds.length; i += 10) {
          const batch = questionIds.slice(i, i + 10)
          const q = query(
            collection(db, "questions"),
            where(documentId(), "in", batch),
          )
          const snap = await getDocs(q)
          const batchDocs = snap.docs.map(
            (d) => ({ ...d.data(), question_id: d.id }) as Question,
          )
          const ordered = batch
            .map((id) => batchDocs.find((q) => q.question_id === id))
            .filter((q): q is Question => q !== undefined)
          allQuestions.push(...ordered)
        }

        setQuestions(allQuestions)
      } catch {
        setError("Failed to load review.")
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [testId, router])

  const filtered = questions.filter((q) => {
    if (!session) return false
    const answer = session.answers?.[q.question_id]
    const isUnattempted = answer === undefined || answer === null || answer === ""
    const resolved = resolveAnswer(answer, q.options ?? [])
    const isCorrect = !isUnattempted && String(resolved).trim() === String(q.correct_answer).trim()

    if (filter === "wrong") return !isCorrect && !isUnattempted
    if (filter === "correct") return isCorrect
    if (filter === "unattempted") return isUnattempted
    return true
  })

  const FILTERS: { key: FilterMode; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: null },
    { key: "wrong", label: "Wrong", icon: <XCircle size={12} className="text-danger" /> },
    { key: "correct", label: "Correct", icon: <CheckCircle2 size={12} className="text-success" /> },
    { key: "unattempted", label: "Skipped", icon: <Minus size={12} className="text-text-secondary" /> },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <p className="text-danger text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/test/${testId}/results`}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-text-primary font-bold text-lg">Question Review</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors min-h-[44px] ${
              filter === key
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-secondary hover:border-text-secondary"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-secondary">
        Showing {filtered.length} of {questions.length} questions
      </p>

      {/* Question cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((q) => {
          const answer = session?.answers?.[q.question_id]
          const isUnattempted = answer === undefined || answer === null || answer === ""
          const resolved = resolveAnswer(answer, q.options ?? [])
          const isCorrect = !isUnattempted && String(resolved).trim() === String(q.correct_answer).trim()

          return (
            <QuestionReviewCard
              key={q.question_id}
              question={q}
              index={questions.indexOf(q)}
              studentAnswer={answer}
              isCorrect={isCorrect}
              isUnattempted={isUnattempted}
            />
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-text-secondary text-center py-8 text-sm">
          No questions in this category.
        </p>
      )}
    </div>
  )
}
