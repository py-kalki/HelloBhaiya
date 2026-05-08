"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, Timestamp } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import type { Exam } from "@/types/student"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

type CreateUserProfileInput = {
  name: string
  studentClass: string
  exam: Exam
  targetDate: string   // ISO date string "YYYY-MM-DD"
  weakSubjects: string[]
}

export async function createUserProfile(input: CreateUserProfileInput) {
  const uid = await verifySession()

  const firebaseUser = await getAuth(adminApp).getUser(uid)
  const db = getFirestore(adminApp)

  const targetDateObj = new Date(input.targetDate)
  if (isNaN(targetDateObj.getTime())) {
    throw new Error("Invalid target date")
  }

  const now = Timestamp.now()

  const userProfile = {
    uid,
    email:               firebaseUser.email ?? "",
    name:                input.name || firebaseUser.displayName || "",
    student_class:       input.studentClass,
    photo_url:           firebaseUser.photoURL ?? "",
    exam:                input.exam,
    target_date:         Timestamp.fromDate(targetDateObj),
    prep_level:          "INTERMEDIATE" as const,
    level:               1,
    xp_total:            200,
    xp_this_week:        200,
    streak_current:      0,
    streak_max:          0,
    streak_freezes:      0,
    last_active:         now,
    chapter_health:      {},
    subject_accuracy:    {},
    wrong_questions:     [],
    notes_highlights:    {},
    weak_subjects:       input.weakSubjects,
    onboarding_complete: true,
    goal_refreshes_today:0,
    goal_refresh_date:   now,
    city:                "",
    invite_code:         uid.slice(0, 8),
    friend_codes:        [],
    created_at:          now,
  }

  await db.collection("users").doc(uid).set(userProfile)

  return { success: true }
}
