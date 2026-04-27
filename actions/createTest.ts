"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { generateQuestionSet } from "@/lib/questionGenerator"
import { revalidatePath } from "next/cache"
import type { TestConfig, TestSession } from "@/types/question"
import { randomUUID } from "crypto"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function createTest(
  config: TestConfig,
): Promise<{ testId: string; warning?: string }> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  // For Mistake Replay: load wrong_questions from profile
  let effectiveConfig = { ...config }
  if (config.mode === "MISTAKE_REPLAY") {
    const userDoc = await db.collection("users").doc(uid).get()
    const wrongQuestions: string[] = userDoc.data()?.wrong_questions ?? []
    if (wrongQuestions.length === 0) {
      throw new Error("No mistakes to replay yet — keep practising!")
    }
    effectiveConfig = {
      ...config,
      chapters: [],
      subjects: [],
      question_count: Math.min(config.question_count || 20, wrongQuestions.length),
    }
  }

  const result = await generateQuestionSet(effectiveConfig)

  if (result.questions.length === 0) {
    throw new Error("No questions match your filters. Try broadening your selection.")
  }

  const testId = randomUUID()
  const now = FieldValue.serverTimestamp()

  const testSession: Omit<TestSession, "created_at" | "completed_at"> & {
    created_at: ReturnType<typeof FieldValue.serverTimestamp>
    completed_at: null
  } = {
    test_id: testId,
    created_at: now,
    completed_at: null,
    status: "IN_PROGRESS",
    mode: config.mode,
    config: effectiveConfig,
    questions: result.questions.map((q) => q.question_id),
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
  }

  await db.collection("users").doc(uid).collection("tests").doc(testId).set(testSession)

  revalidatePath("/dashboard")
  if (result.warning) return { testId, warning: result.warning }
  return { testId }
}
