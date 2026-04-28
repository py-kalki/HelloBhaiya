import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { notFound } from "next/navigation"
import { lookupLevel } from "@/lib/scoring"
import { Trophy, Zap, Target } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const revalidate = 3600 // ISR: re-generate at most once per hour

type Props = { params: Promise<{ testId: string }> }

async function getTestData(testId: string) {
  const db = getFirestore(adminApp)

  // testId is "{uid}:{testId}" or we search all users — embed uid in URL for simplicity
  // Format: /share/{uid}/{testId} — but we use a single segment; encode as "uid_testid"
  // The share URL uses format: uid-testid (first UUID segment is uid, second is testId)
  // Actually: store uid in the test session itself — let's query by testId across users
  // For MVP: test must be public. We encode uid-testId in the path.
  const underscoreIdx = testId.indexOf("_")
  if (underscoreIdx === -1) return null

  const uid = testId.slice(0, underscoreIdx)
  const realTestId = testId.slice(underscoreIdx + 1)

  const snap = await db
    .collection("users")
    .doc(uid)
    .collection("tests")
    .doc(realTestId)
    .get()

  if (!snap.exists) return null

  const data = snap.data()!
  if (data.status !== "COMPLETED") return null

  const userSnap = await db.collection("users").doc(uid).get()
  const userName: string = userSnap.data()?.name ?? "A student"

  return {
    score: data.score as number,
    maxScore: data.max_score as number,
    accuracy: data.accuracy as number,
    xpEarned: data.xp_earned as number,
    totalXp: (userSnap.data()?.xp_total as number) ?? 0,
    level: (userSnap.data()?.level as number) ?? 1,
    userName,
    mode: data.mode as string,
    questionCount: (data.questions as string[]).length,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params
  const test = await getTestData(testId)
  if (!test) return { title: "HelloBhaiya" }

  return {
    title: `${test.userName} scored ${test.score}/${test.maxScore} on HelloBhaiya`,
    description: `${test.accuracy}% accuracy · +${test.xpEarned} XP earned. Study smarter with HelloBhaiya.`,
    openGraph: {
      title: `${test.score}/${test.maxScore} — ${test.accuracy}% accuracy`,
      description: `${test.userName} just aced a ${test.questionCount}-question test on HelloBhaiya!`,
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { testId } = await params
  const test = await getTestData(testId)

  if (!test) notFound()

  const level = lookupLevel(test.totalXp)
  const accuracyColor =
    test.accuracy >= 75 ? "text-success" : test.accuracy >= 50 ? "text-warning" : "text-danger"
  const accuracyBg =
    test.accuracy >= 75 ? "bg-success/10 border-success/30" : test.accuracy >= 50 ? "bg-warning/10 border-warning/30" : "bg-danger/10 border-danger/30"

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1">
          <p className="text-xs text-text-secondary tracking-widest uppercase">HelloBhaiya</p>
          <p className="text-sm text-text-secondary">{test.userName}</p>
        </div>

        {/* Score card */}
        <div className={`rounded-2xl border p-6 text-center space-y-2 ${accuracyBg}`}>
          <p className={`text-6xl font-bold font-mono ${accuracyColor}`}>{test.score}</p>
          <p className="text-text-secondary text-sm">/ {test.maxScore}</p>
          <p className={`text-2xl font-bold ${accuracyColor}`}>{test.accuracy}%</p>
          <p className="text-xs text-text-secondary">accuracy</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-2 border border-border rounded-xl p-3 text-center space-y-1">
            <Zap size={16} className="text-warning mx-auto" />
            <p className="text-sm font-bold text-warning">+{test.xpEarned}</p>
            <p className="text-[10px] text-text-secondary">XP</p>
          </div>
          <div className="bg-surface-2 border border-border rounded-xl p-3 text-center space-y-1">
            <Trophy size={16} className="text-accent mx-auto" />
            <p className="text-sm font-bold text-text-primary">{level.title}</p>
            <p className="text-[10px] text-text-secondary">Lv {test.level}</p>
          </div>
          <div className="bg-surface-2 border border-border rounded-xl p-3 text-center space-y-1">
            <Target size={16} className="text-text-secondary mx-auto" />
            <p className="text-sm font-bold text-text-primary">{test.questionCount}Q</p>
            <p className="text-[10px] text-text-secondary capitalize">{test.mode.toLowerCase().replace("_", " ")}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 text-center">
          <p className="text-sm text-text-secondary">
            Think you can beat this? Try HelloBhaiya — free for all NEET & JEE aspirants.
          </p>
          <Link
            href="/login"
            className="block w-full py-3.5 bg-accent text-background font-bold rounded-2xl text-sm min-h-[44px] text-center"
          >
            Start Studying Free →
          </Link>
          <p className="text-xs text-text-secondary">
            Gamified tests · Spaced revision · Live battles
          </p>
        </div>

        <p className="text-center text-xs text-text-muted">hellobhaiya.vercel.app</p>
      </div>
    </div>
  )
}
