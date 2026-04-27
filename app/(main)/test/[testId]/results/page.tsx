import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { notFound, redirect } from "next/navigation"
import { ScoreHero } from "@/components/results/ScoreHero"
import { XPEarnedDisplay } from "@/components/results/XPEarnedDisplay"
import { PerformanceCards } from "@/components/results/PerformanceCards"
import { WeakAreaAlert } from "@/components/results/WeakAreaAlert"
import { ResultsActions } from "@/components/results/ResultsActions"
import { PerformanceTrendChart } from "@/components/results/PerformanceTrendChart"
import type { TestSession } from "@/types/question"
import type { UserProfile } from "@/types/student"

type Props = {
  params: Promise<{ testId: string }>
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

  // Load user for XP before/after
  const userSnap = await db.collection("users").doc(uid).get()
  const profile = userSnap.data() as UserProfile
  const xpBefore = (profile.xp_total ?? 0) - (session.xp_earned ?? 0)

  // Load last 10 COMPLETED tests for trend (same subjects)
  const testsSnap = await db
    .collection("users")
    .doc(uid)
    .collection("tests")
    .where("status", "==", "COMPLETED")
    .orderBy("completed_at", "desc")
    .limit(10)
    .get()

  const trendData = testsSnap.docs
    .map((d, i) => {
      const t = d.data() as TestSession
      return {
        label: `T${testsSnap.docs.length - i}`,
        accuracy: t.accuracy ?? 0,
      }
    })
    .reverse()

  const answered = Object.keys(session.answers ?? {}).length
  const correctCount = answered - (session.wrong_questions?.length ?? 0)
  const wrongCount = session.wrong_questions?.length ?? 0
  const unattempted = (session.questions?.length ?? 0) - answered

  return (
    <div className="flex flex-col gap-5 p-4 max-w-2xl mx-auto w-full pb-10">
      <h1 className="text-text-primary font-bold text-lg">Test Results</h1>

      <ScoreHero
        score={session.score}
        maxScore={session.max_score}
        accuracy={session.accuracy}
        subjectAccuracy={session.subject_accuracy ?? {}}
      />

      <XPEarnedDisplay
        xpEarned={session.xp_earned}
        xpBefore={xpBefore}
        accuracy={session.accuracy}
        timeTakenSeconds={session.time_taken_seconds}
        timerMinutes={session.config?.timer_minutes ?? null}
      />

      <PerformanceCards
        correct={correctCount}
        wrong={wrongCount}
        unattempted={unattempted}
        timeTakenSeconds={session.time_taken_seconds}
        timerMinutes={session.config?.timer_minutes ?? null}
      />

      <WeakAreaAlert chapterAccuracy={session.chapter_accuracy ?? {}} />

      <PerformanceTrendChart data={trendData} />

      <ResultsActions testId={testId} />
    </div>
  )
}
