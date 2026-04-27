"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue, WriteBatch } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { calculateScore, calculateXP, calculateChapterHealth, lookupLevel, rollingAccuracy } from "@/lib/scoring"
import { revalidatePath } from "next/cache"
import type { Question, TestSession } from "@/types/question"
import { toISTDateString } from "@/lib/dateUtils"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

type SubmitPayload = {
  testId: string
  answers: Record<string, string | number>
  flagged: string[]
  timeTakenSeconds: number
  pausesUsed: number
}

export async function submitTest(payload: SubmitPayload): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const today = toISTDateString()

  const testRef = db.collection("users").doc(uid).collection("tests").doc(payload.testId)
  const testSnap = await testRef.get()
  if (!testSnap.exists) throw new Error("Test not found")

  const session = testSnap.data() as TestSession
  if (session.status === "COMPLETED") return // idempotent

  // Fetch all questions for this test
  const questionIds = session.questions
  const allQuestions: Question[] = []

  for (let i = 0; i < questionIds.length; i += 10) {
    const batch = questionIds.slice(i, i + 10)
    const snaps = await Promise.all(
      batch.map((id) => db.collection("questions").doc(id).get()),
    )
    for (const s of snaps) {
      if (s.exists) allQuestions.push(s.data() as Question)
    }
  }

  // Calculate score
  const scheme = { correct: 4, wrong: -1, unattempted: 0 }
  const scoreResult = calculateScore(allQuestions, payload.answers, scheme)
  const xpEarned = calculateXP(
    scoreResult.accuracy,
    payload.timeTakenSeconds,
    session.config.timer_minutes,
  )

  // Load user profile
  const userRef = db.collection("users").doc(uid)
  const userSnap = await userRef.get()
  const userData = userSnap.data() ?? {}

  const existingChapterHealth: Record<string, number> = userData.chapter_health ?? {}
  const existingSubjectAccuracy: Record<string, number> = userData.subject_accuracy ?? {}
  const existingWrongQuestions: string[] = userData.wrong_questions ?? []
  const streakCurrent: number = userData.streak_current ?? 0
  const streakMax: number = userData.streak_max ?? 0
  const lastActive: string = userData.last_active_date ?? ""
  const xpTotal: number = userData.xp_total ?? 0
  const xpThisWeek: number = userData.xp_this_week ?? 0

  // Update chapter health for each chapter in this test
  const updatedChapterHealth = { ...existingChapterHealth }
  for (const [chapterId, chapterAccuracy] of Object.entries(scoreResult.chapterAccuracy)) {
    const currentHealth = existingChapterHealth[chapterId] ?? 50
    const newHealth = calculateChapterHealth(chapterAccuracy, 0, 10)
    // Blend 60% new, 40% existing for stability
    updatedChapterHealth[chapterId] = Math.round(newHealth * 0.6 + currentHealth * 0.4)
  }

  // Update subject rolling accuracy
  const updatedSubjectAccuracy = { ...existingSubjectAccuracy }
  for (const [subject, accuracy] of Object.entries(scoreResult.subjectAccuracy)) {
    updatedSubjectAccuracy[subject] = rollingAccuracy(accuracy, existingSubjectAccuracy[subject])
  }

  // Merge wrong questions (deduplicated)
  const updatedWrongQuestions = [
    ...new Set([...existingWrongQuestions, ...scoreResult.wrongQuestions]),
  ]

  // Streak logic
  const isNewDay = lastActive !== today
  const wasYesterday =
    lastActive ===
    new Date(Date.now() - 86400_000).toISOString().split("T")[0]
  const newStreak = isNewDay ? (wasYesterday ? streakCurrent + 1 : 1) : streakCurrent
  const newStreakMax = Math.max(streakMax, newStreak)
  const newLevel = lookupLevel(xpTotal + xpEarned)

  // Batch write
  const writeBatch: WriteBatch = db.batch()

  // Update test document
  writeBatch.update(testRef, {
    status: "COMPLETED",
    completed_at: FieldValue.serverTimestamp(),
    answers: payload.answers,
    flagged: payload.flagged,
    score: scoreResult.score,
    max_score: scoreResult.maxScore,
    accuracy: scoreResult.accuracy,
    subject_accuracy: scoreResult.subjectAccuracy,
    chapter_accuracy: scoreResult.chapterAccuracy,
    wrong_questions: scoreResult.wrongQuestions,
    time_taken_seconds: payload.timeTakenSeconds,
    xp_earned: xpEarned,
    pauses_used: payload.pausesUsed,
  })

  // Update user profile
  writeBatch.update(userRef, {
    xp_total: FieldValue.increment(xpEarned),
    xp_this_week: FieldValue.increment(xpEarned),
    level: newLevel.level,
    streak_current: newStreak,
    streak_max: newStreakMax,
    last_active: FieldValue.serverTimestamp(),
    last_active_date: today,
    chapter_health: updatedChapterHealth,
    subject_accuracy: updatedSubjectAccuracy,
    wrong_questions: updatedWrongQuestions,
  })

  // Check and update daily goal progress
  const goalRef = db
    .collection("users")
    .doc(uid)
    .collection("dailyGoal")
    .doc("current")
  const goalSnap = await goalRef.get()
  if (goalSnap.exists) {
    const goal = goalSnap.data()!
    if (goal.date === today && !goal.complete) {
      const newDone = (goal.done ?? 0) + allQuestions.length
      const isComplete = newDone >= goal.target
      writeBatch.update(goalRef, {
        done: newDone,
        complete: isComplete,
      })
    }
  }

  // Update leaderboard entry
  const leaderboardRef = db.collection("leaderboard").doc("weekly").collection("entries").doc(uid)
  writeBatch.set(
    leaderboardRef,
    {
      uid,
      name: userData.name ?? "",
      photo_url: userData.photo_url ?? "",
      level: newLevel.level,
      level_title: newLevel.title,
      xp_this_week: xpThisWeek + xpEarned,
      streak_current: newStreak,
      city: userData.city ?? "",
      invite_code: userData.invite_code ?? "",
    },
    { merge: true },
  )

  await writeBatch.commit()
  revalidatePath("/dashboard")
  revalidatePath(`/test/${payload.testId}/results`)
}
