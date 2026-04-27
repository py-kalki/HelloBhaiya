import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import { predictNEETScore } from "@/lib/predictedScore"
import { getChapterStatus } from "@/types/syllabus"
import type { SyllabusChapter, ChapterWithProgress } from "@/types/syllabus"
import { SubjectTabs } from "@/components/roadmap/SubjectTabs"
import { PredictedScoreWidget } from "@/components/roadmap/PredictedScoreWidget"
import { SubjectProgressRing } from "@/components/roadmap/SubjectProgressRing"
import { RoadmapChapterList } from "@/components/roadmap/RoadmapChapterList"
import { ChapterDetailPanel } from "@/components/roadmap/ChapterDetailPanel"

const VALID_SUBJECTS: Record<string, string> = {
  biology:   "Biology",
  physics:   "Physics",
  chemistry: "Chemistry",
}

const DAY_MS = 24 * 60 * 60 * 1000
const REVISION_DAYS = 14

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

interface PageProps {
  params: Promise<{ subject: string }>
  searchParams: Promise<{ chapter?: string }>
}

export default async function SubjectRoadmapPage({ params, searchParams }: PageProps) {
  const { subject: subjectSlug } = await params
  const { chapter: selectedChapterId } = await searchParams

  const subject = VALID_SUBJECTS[subjectSlug]
  if (!subject) notFound()

  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const [userDoc, chaptersSnap] = await Promise.all([
    db.collection("users").doc(decoded.uid).get(),
    db
      .collection("syllabus")
      .doc("neet")
      .collection("chapters")
      .where("subject", "==", subject)
      .limit(60)
      .get(),
  ])

  const userData = userDoc.data()
  const chapterHealth: Record<string, number> = userData?.chapter_health ?? {}
  const subjectAccuracy: Record<string, number> = userData?.subject_accuracy ?? {}
  // eslint-disable-next-line react-hooks/purity
  const lastActiveTs: number = userData?.last_active?.toDate().getTime() ?? Date.now()
  const topicProgress: Record<string, Record<number, boolean>> =
    userData?.topic_progress ?? {}
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now()

  const chapters: ChapterWithProgress[] = chaptersSnap.docs.map((doc) => {
    const c = doc.data() as SyllabusChapter
    const health = chapterHealth[c.chapter_id]
    const daysSince = Math.floor((nowMs - lastActiveTs) / DAY_MS)
    return {
      ...c,
      health:        health ?? 0,
      status:        getChapterStatus(health),
      lastPracticed: health !== undefined ? lastActiveTs : null,
      needsRevision: health !== undefined && daysSince >= REVISION_DAYS,
    }
  })

  const [low, high] = predictNEETScore(subjectAccuracy)
  const solid = chapters.filter((c) => c.status === "SOLID").length
  const avg =
    chapters.length > 0
      ? chapters.reduce((sum, c) => sum + (c.status !== "NOT_STARTED" ? c.health : 0), 0) /
        chapters.length
      : 0

  const selectedChapter = selectedChapterId
    ? chapters.find((c) => c.chapter_id === selectedChapterId)
    : undefined

  const chapterTopicProgress = selectedChapterId
    ? (topicProgress[selectedChapterId] ?? {})
    : {}

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{subject}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{chapters.length} chapters</p>
        </div>

        <PredictedScoreWidget low={low} high={high} subjectAccuracy={subjectAccuracy} />

        <div className="flex justify-center py-3 bg-surface-2 border border-border rounded-2xl">
          <SubjectProgressRing
            subject={subject}
            totalChapters={chapters.length}
            solidChapters={solid}
            averageHealth={Math.round(avg)}
          />
        </div>

        <SubjectTabs active={subject} />

        {selectedChapter ? (
          <ChapterDetailPanel
            chapter={selectedChapter}
            subject={subject}
            initialProgress={chapterTopicProgress}
          />
        ) : (
          <RoadmapChapterList chapters={chapters} subject={subject} />
        )}
      </div>
    </div>
  )
}
