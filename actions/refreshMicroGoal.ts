"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { toISTDateString } from "@/lib/dateUtils"
import { revalidatePath } from "next/cache"
import type { DailyGoal } from "@/types/student"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function refreshMicroGoal(): Promise<DailyGoal> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const today = toISTDateString()

  const goalRef = db.collection("users").doc(uid).collection("dailyGoal").doc("current")
  const existing = await goalRef.get()

  if (!existing.exists) throw new Error("No goal to refresh")

  const current = existing.data() as DailyGoal

  // Reset counter if it's a new day
  const effectiveRefreshes =
    current.date === today ? (current.refreshes_used ?? 0) : 0

  if (effectiveRefreshes >= 2) {
    throw new Error("No refreshes left for today")
  }

  const userDoc = await db.collection("users").doc(uid).get()
  const userData = userDoc.data()
  if (!userData) throw new Error("User not found")

  const chapterHealth: Record<string, number> = userData.chapter_health ?? {}
  const excludeChapter = current.chapter_id

  const entries = Object.entries(chapterHealth)
    .filter(([id]) => id !== excludeChapter)
    .filter(([, h]) => h < 75)

  let newGoal: DailyGoal

  if (entries.length === 0) {
    const exam: string = userData.exam ?? "NEET"
    newGoal = {
      date:           today,
      text:           `Take a full ${exam === "NEET" ? "NEET" : "JEE"} mock test`,
      subject:        "General",
      chapter_id:     "mock-test",
      target:         90,
      done:           0,
      complete:       false,
      refreshes_used: effectiveRefreshes + 1,
    }
  } else {
    const [topChapterId, topHealth] = entries.sort(([, a], [, b]) => b - a)[0]!
    const target = topHealth < 50 ? 20 : 25
    const chapterLabel = topChapterId
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ")

    newGoal = {
      date:           today,
      text:           `Complete ${target} ${chapterLabel} MCQs`,
      subject:        "Mixed",
      chapter_id:     topChapterId,
      target,
      done:           0,
      complete:       false,
      refreshes_used: effectiveRefreshes + 1,
    }
  }

  await goalRef.set(newGoal)
  revalidatePath("/dashboard")
  return newGoal
}
