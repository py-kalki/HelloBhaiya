import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import { predictNEETScore } from "@/lib/predictedScore"
import { getSyllabus } from "@/lib/syllabusData"
import { PredictedScoreCard } from "@/components/analytics/PredictedScoreCard"
import { ChapterHeatmap } from "@/components/analytics/ChapterHeatmap"
import type { AccuracyDataPoint } from "@/components/analytics/SubjectAccuracyChart"
import { SubjectAccuracyChart } from "@/components/analytics/SubjectAccuracyChartWrapper"

export default async function AnalyticsPage() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, false)
    uid = decoded.uid
  } catch {
    redirect("/login")
  }

  const db = getFirestore(adminApp)

  const [userSnap, testsSnap] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db
      .collection("users")
      .doc(uid)
      .collection("tests")
      .where("status", "==", "COMPLETED")
      .orderBy("completed_at", "desc")
      .limit(20)
      .get(),
  ])

  const userData = userSnap.data() ?? {}
  const subjectAccuracy: Record<string, number> = userData.subject_accuracy ?? {}
  const chapterHealth: Record<string, number> = userData.chapter_health ?? {}
  const exam: string = userData.exam ?? "NEET"

  // Build time-series data from recent tests (oldest-first for the chart)
  const chartData: AccuracyDataPoint[] = testsSnap.docs
    .filter((d) => d.data().subject_accuracy)
    .map((d) => {
      const data = d.data()
      const completedAt = data.completed_at?.toDate?.() ?? new Date()
      const label = completedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      return { label, ...(data.subject_accuracy as Record<string, number>) }
    })
    .reverse()

  // Build subject→chapters map for heatmap
  const syllabus = getSyllabus(exam)
  const subjectChapterMap = Object.fromEntries(
    syllabus.map((s) => [s.name, s.chapters.map((c) => ({ id: c.id, name: c.name }))])
  )

  const [low, high] = predictNEETScore(subjectAccuracy)

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full pb-10">
      <h1 className="text-text-primary font-bold text-xl">Analytics</h1>

      {/* Predicted score */}
      <PredictedScoreCard low={low} high={high} subjectAccuracy={subjectAccuracy} />

      {/* Subject accuracy trend */}
      <section className="bg-surface border border-border rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Subject Accuracy Trend</h2>
        <SubjectAccuracyChart data={chartData} />
      </section>

      {/* Chapter health heatmap */}
      <section className="bg-surface border border-border rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Chapter Health</h2>
        <p className="text-xs text-text-secondary">
          Based on accuracy, recency, and volume of questions attempted.
        </p>
        <ChapterHeatmap
          chapterHealth={chapterHealth}
          subjectChapterMap={subjectChapterMap}
        />
      </section>

      {/* Tests summary */}
      <section className="bg-surface border border-border rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{testsSnap.size}</p>
            <p className="text-xs text-text-secondary mt-0.5">Tests Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">
              {Object.keys(subjectAccuracy).length > 0
                ? `${Math.round(Object.values(subjectAccuracy).reduce((a, b) => a + b, 0) / Object.values(subjectAccuracy).length)}%`
                : "—"}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">Overall Accuracy</p>
          </div>
        </div>
      </section>
    </div>
  )
}
