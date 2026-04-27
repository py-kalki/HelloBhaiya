"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function generateRevisionSet(): Promise<string> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const userDoc = await db.collection("users").doc(uid).get()
  const userData = userDoc.data()
  if (!userData) throw new Error("User not found")

  const chapterHealth: Record<string, number> = userData.chapter_health ?? {}
  const wrongQuestions: string[] = userData.wrong_questions ?? []

  // Pick top 5 weakest chapters to revise
  const weakChapters = Object.entries(chapterHealth)
    .filter(([, h]) => h < 75)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)
    .map(([id]) => id)

  // Fetch 1 question per weak chapter + fill from wrong_questions
  const questionIds: string[] = []

  for (const chapterId of weakChapters.slice(0, 5)) {
    const snap = await db
      .collection("questions")
      .where("chapter_id", "==", chapterId)
      .limit(1)
      .get()
    snap.docs.forEach((d) => questionIds.push(d.id))
  }

  // Fill remaining slots from wrong_questions (SM-2 overdue logic)
  const needed = 5 - questionIds.length
  if (needed > 0 && wrongQuestions.length > 0) {
    const sample = wrongQuestions
      .filter((id) => !questionIds.includes(id))
      .slice(0, needed)
    questionIds.push(...sample)
  }

  if (questionIds.length === 0) {
    throw new Error("No revision questions available yet — complete more tests first!")
  }

  const testId = randomUUID()
  await db
    .collection("users")
    .doc(uid)
    .collection("tests")
    .doc(testId)
    .set({
      test_id: testId,
      created_at: FieldValue.serverTimestamp(),
      completed_at: null,
      status: "IN_PROGRESS",
      mode: "REVISION",
      config: {
        subjects: [],
        chapters: weakChapters,
        difficulty: { easy: 33, medium: 34, hard: 33 },
        numerical_pct: 0,
        question_count: questionIds.length,
        timer_minutes: null,
        mode: "REVISION",
      },
      questions: questionIds,
      answers: {},
      flagged: [],
      score: 0,
      max_score: 0,
      accuracy: 0,
      subject_accuracy: {},
      chapter_accuracy: {},
      wrong_questions: [],
      time_taken_seconds: 0,
      xp_earned: 0,
      pauses_used: 0,
    })

  revalidatePath("/revision")
  return testId
}
