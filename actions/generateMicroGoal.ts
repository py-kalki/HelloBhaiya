"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { toISTDateString } from "@/lib/dateUtils"
import type { DailyGoal } from "@/types/student"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function generateMicroGoal(): Promise<DailyGoal> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const today = toISTDateString()

  // Check if a goal already exists for today
  const existing = await db.collection("users").doc(uid).collection("dailyGoal").doc("current").get()
  if (existing.exists && existing.data()?.date === today) {
    return existing.data() as DailyGoal
  }

  const userDoc = await db.collection("users").doc(uid).get()
  const userData = userDoc.data()
  if (!userData) throw new Error("User not found")

  const chapterHealth: Record<string, number> = userData.chapter_health ?? {}
  const exam: string = userData.exam ?? "NEET"

  let goal: DailyGoal

  // If no chapters tracked yet or all chapters healthy → general test goal
  const entries = Object.entries(chapterHealth)
  const weakEntries = entries.filter(([, h]) => h < 75)

  if (weakEntries.length === 0) {
    goal = {
      date:          today,
      text:          `Take a full ${exam === "NEET" ? "NEET" : "JEE"} mock test`,
      subject:       "General",
      chapter_id:    "mock-test",
      target:        90,
      done:          0,
      complete:      false,
      refreshes_used: 0,
    }
  } else {
    // Sort by priority: (100 - health) × recency_multiplier
    const sorted = weakEntries.sort(([, a], [, b]) => {
      const priorityA = (100 - a) * (a < 50 ? 1.5 : 1.0)
      const priorityB = (100 - b) * (b < 50 ? 1.5 : 1.0)
      return priorityB - priorityA
    })

    const [topChapterId, topHealth] = sorted[0]!

    const target = topHealth < 50 ? 20 : topHealth < 75 ? 25 : 30
    const chapterLabel = topChapterId
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ")

    goal = {
      date:           today,
      text:           `Complete ${target} ${chapterLabel} MCQs`,
      subject:        "Mixed",
      chapter_id:     topChapterId,
      target,
      done:           0,
      complete:       false,
      refreshes_used: 0,
    }
  }

  await db.collection("users").doc(uid).collection("dailyGoal").doc("current").set(goal)
  revalidatePath("/dashboard")
  return goal
}
