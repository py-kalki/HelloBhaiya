import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import type { TestSession, Question } from "@/types/question"

type Props = { params: Promise<{ testId: string }> }

const SUBJECT_META: Record<string, { name: string; color: string; glow: string }> = {
  Physics:   { name: "Physics",   color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  Chemistry: { name: "Chemistry", color: "#34d399", glow: "rgba(52,211,153,0.15)" },
  Botany:    { name: "Botany",    color: "#fbbf24", glow: "rgba(251,191,36,0.15)"  },
  Zoology:   { name: "Zoology",   color: "#f472b6", glow: "rgba(244,114,182,0.15)" },
}

const LABELS = ["A", "B", "C", "D"]

function resolveAnswer(answer: string | number | undefined, options: string[]): string | number | undefined {
  if (answer === undefined || answer === null || answer === "") return answer
  const idx = LABELS.indexOf(String(answer))
  return idx !== -1 && options[idx] !== undefined ? options[idx] : answer
}

function gradeLabel(pct: number) {
  if (pct >= 75) return { text: "Outstanding 🏆", color: "#D4FF59" }
  if (pct >= 50) return { text: "Good Work 👍",   color: "#34d399" }
  if (pct >= 30) return { text: "Keep Going 💪",  color: "#fbbf24" }
  return              { text: "Needs Work 📚",    color: "#f87171" }
}

export default async function ResultsPage({ params }: Props) {
  const { testId } = await params

  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  const { uid } = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
  const db = getFirestore(adminApp)

  const testRef = db.collection("users").doc(uid).collection("tests").doc(testId)
  const testSnap = await testRef.get()
  if (!testSnap.exists) notFound()

  const session = testSnap.data() as TestSession
  if (session.status !== "COMPLETED") redirect(`/test/${testId}/take`)

  // Fetch all question docs
  const questionIds = session.questions ?? []
  const allQuestions: Question[] = []
  for (let i = 0; i < questionIds.length; i += 10) {
    const batch = questionIds.slice(i, i + 10)
    const snaps = await Promise.all(batch.map((id) => db.collection("questions").doc(id).get()))
    for (const s of snaps) if (s.exists) allQuestions.push(s.data() as Question)
  }

  const answers = session.answers ?? {}
  const answered = Object.keys(answers).length
  let correct = 0, wrong = 0
  const subjectMap: Record<string, { c: number; w: number; s: number; score: number; total: number }> = {}
  const topicMap: Record<string, { subject: string; c: number; total: number }> = {}

  for (const q of allQuestions) {
    const ans = answers[q.question_id]
    const isUnattempted = ans === undefined || ans === null || ans === ""
    const resolved = resolveAnswer(ans, q.options ?? [])
    const isCorrect = !isUnattempted && String(resolved).trim() === String(q.correct_answer).trim()
    const subj = q.subject ?? "Unknown"
    const topic = q.topic ?? q.chapter ?? "General"
    const maxPerQ = 4

    if (!subjectMap[subj]) subjectMap[subj] = { c: 0, w: 0, s: 0, score: 0, total: 0 }
    subjectMap[subj].total += maxPerQ
    if (!topicMap[topic]) topicMap[topic] = { subject: subj, c: 0, total: 0 }
    topicMap[topic].total++

    if (isUnattempted) {
      subjectMap[subj].s++
    } else if (isCorrect) {
      correct++
      subjectMap[subj].c++
      subjectMap[subj].score += 4
      topicMap[topic].c++
    } else {
      wrong++
      subjectMap[subj].w++
      subjectMap[subj].score -= 1
    }
  }

  const unattempted = allQuestions.length - answered
  const totalScore = session.score ?? 0
  const maxScore = session.max_score ?? allQuestions.length * 4
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const grade = gradeLabel(pct)

  // Weak topics: <60% accuracy
  const weakTopics = Object.entries(topicMap)
    .filter(([, d]) => d.total > 0 && d.c / d.total < 0.6)
    .sort((a, b) => a[1].c / a[1].total - b[1].c / b[1].total)
    .slice(0, 8)

  // user XP
  const userSnap = await db.collection("users").doc(uid).get()
  const xpEarned = session.xp_earned ?? 0

  return (
    <div className="flex flex-col gap-5 p-4 max-w-3xl mx-auto w-full pb-16 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-text-primary font-bold text-lg">Test Results</h1>
        <div className="flex gap-2">
          <Link
            href="/test/build"
            className="flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-xl px-4 py-2.5 min-h-[44px] hover:border-text-secondary transition-colors"
          >
            New Test
          </Link>
          <Link
            href={`/test/${testId}/review`}
            className="flex items-center gap-1.5 text-xs bg-accent text-background font-bold rounded-xl px-4 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
          >
            Full Review →
          </Link>
        </div>
      </div>

      {/* Score Hero */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="grid grid-cols-[auto_1fr] gap-6 p-6 items-center max-sm:grid-cols-1 max-sm:gap-4">
          {/* Big score */}
          <div className="text-center max-sm:text-left">
            <div className="font-display text-7xl font-bold text-text-primary leading-none">{totalScore}</div>
            <div className="text-xs text-text-secondary mt-1">out of {maxScore}</div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-3">
            <div className="font-display text-2xl font-bold" style={{ color: grade.color }}>
              {grade.text}
            </div>
            <div className="text-xs text-text-secondary">{pct}% scored</div>
            <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-success">{correct}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">Correct</div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-danger">{wrong}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">Wrong</div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-warning">{unattempted}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">Skipped</div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-accent">{accuracy}%</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
        {/* XP strip */}
        {xpEarned > 0 && (
          <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-accent/5">
            <span className="text-xs text-text-secondary">XP Earned this test</span>
            <span className="text-sm font-bold text-accent">+{xpEarned} XP ⚡</span>
          </div>
        )}
      </div>

      {/* Subject Performance */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border">
          Subject Performance
        </div>
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          {Object.entries(subjectMap).map(([subj, data]) => {
            const meta = SUBJECT_META[subj] ?? { name: subj, color: "#A1A1AA", glow: "rgba(161,161,170,0.1)" }
            const subjPct = data.total > 0 ? Math.max(0, Math.round((data.score / data.total) * 100)) : 0
            return (
              <div
                key={subj}
                className="relative rounded-xl border border-border bg-surface overflow-hidden p-4"
              >
                {/* color top bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: meta.color }} />
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: meta.color }}>
                  {meta.name}
                </div>
                <div className="font-display text-3xl font-bold text-text-primary mb-2">
                  {data.score > 0 ? "+" : ""}{data.score} <span className="text-sm text-text-secondary font-normal">pts</span>
                </div>
                {/* progress bar */}
                <div className="h-1 bg-surface-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${subjPct}%`, background: meta.color }}
                  />
                </div>
                <div className="text-xs text-text-secondary">
                  ✓ {data.c} correct &nbsp;✗ {data.w} wrong &nbsp;— {data.s} skipped
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weak Topics */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border">
          Topics to Revise
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span>⚠</span> Weak Topic Analysis
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-success text-sm py-1">🎉 No weak topics — excellent preparation!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {weakTopics.map(([topic, data]) => {
                const meta = SUBJECT_META[data.subject] ?? { name: data.subject, color: "#A1A1AA", glow: "" }
                const topicPct = Math.round((data.c / data.total) * 100)
                return (
                  <div key={topic} className="flex items-center justify-between gap-3 bg-surface-2 rounded-lg px-3 py-2.5 flex-wrap">
                    <div>
                      <div className="text-sm text-text-primary font-medium">{topic}</div>
                      <div className="text-xs mt-0.5" style={{ color: meta.color }}>{meta.name}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-14 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-danger rounded-full" style={{ width: `${topicPct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-danger min-w-[30px]">{topicPct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Question Review (inline, like HTML reference) */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-text-secondary mb-3 pb-2 border-b border-border">
          Full Question Review
        </div>
        <div className="flex flex-col gap-3">
          {allQuestions.map((q, i) => {
            const ans = answers[q.question_id]
            const isUnattempted = ans === undefined || ans === null || ans === ""
            const resolved = resolveAnswer(ans, q.options ?? [])
            const isCorrect = !isUnattempted && String(resolved).trim() === String(q.correct_answer).trim()
            const status = isUnattempted ? "s" : isCorrect ? "c" : "w"
            const scoreStr = isUnattempted ? "0" : isCorrect ? "+4" : "−1"
            const correctIndex = (q.options ?? []).findIndex(
              (o) => String(o).trim() === String(q.correct_answer).trim()
            )

            const borderLeft =
              status === "c" ? "border-l-success/60" :
              status === "w" ? "border-l-danger/60"  : "border-l-border"

            return (
              <div
                key={q.question_id}
                className={`rounded-xl border border-border border-l-4 ${borderLeft} bg-surface p-4 flex flex-col gap-3 animate-fade-in`}
              >
                {/* Q header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-text-secondary font-mono">Q{i + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    status === "c" ? "bg-success/10 text-success border-success/30" :
                    status === "w" ? "bg-danger/10 text-danger border-danger/30"    :
                    "bg-surface-2 text-text-secondary border-border"
                  }`}>
                    {status === "c" ? "✓ Correct" : status === "w" ? "✗ Wrong" : "— Skipped"}
                  </span>
                  {q.topic && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-border text-text-secondary">
                      {q.topic}
                    </span>
                  )}
                  {q.type === "NUMERICAL" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 border border-warning/30 text-warning font-semibold">
                      NUMERICAL
                    </span>
                  )}
                  {q.is_pyq && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 border border-violet/30 text-violet font-semibold">
                      PYQ
                    </span>
                  )}
                  <span
                    className="ml-auto text-sm font-bold"
                    style={{ color: status === "c" ? "var(--success)" : status === "w" ? "var(--danger)" : "var(--text-secondary)" }}
                  >
                    {scoreStr} pts
                  </span>
                </div>

                {/* Question text */}
                <p className="text-text-primary text-sm leading-relaxed">{q.question_text}</p>

                {/* Options */}
                {q.type !== "NUMERICAL" && (
                  <div className="flex flex-col gap-1.5">
                    {(q.options ?? []).map((opt, oi) => {
                      const label = LABELS[oi]!
                      const isCorrectOpt = correctIndex === oi
                      const isStudentOpt = String(ans) === label
                      let cls = "text-text-secondary"
                      let bg = ""
                      if (isCorrectOpt) { cls = "text-success font-medium"; bg = "bg-success/8 border border-success/25" }
                      else if (isStudentOpt && !isCorrectOpt) { cls = "text-danger"; bg = "bg-danger/8 border border-danger/25" }
                      return (
                        <div key={oi} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${bg || "border border-transparent"}`}>
                          <span className={`font-bold shrink-0 font-mono text-xs w-4 mt-0.5 ${cls}`}>{label}.</span>
                          <span className={cls}>{opt}</span>
                          {isCorrectOpt && <span className="ml-auto text-success shrink-0">✓</span>}
                          {isStudentOpt && !isCorrectOpt && <span className="ml-auto text-danger shrink-0">✗</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="border-l-2 border-border pl-3 bg-surface-2 rounded-r-lg p-3 text-xs text-text-secondary leading-relaxed">
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 justify-center pt-2">
        <Link
          href="/test/build"
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
        >
          Take Another Test
        </Link>
      </div>

    </div>
  )
}
