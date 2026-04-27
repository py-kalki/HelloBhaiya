"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { toISTDateString } from "@/lib/dateUtils"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

type StreakResult = {
  streak: number
  streakMax: number
  froze: boolean
}

export async function updateStreak(): Promise<StreakResult> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const today = toISTDateString()

  const userRef = db.collection("users").doc(uid)
  const userSnap = await userRef.get()
  const data = userSnap.data() ?? {}

  const streakCurrent: number = data.streak_current ?? 0
  const streakMax: number = data.streak_max ?? 0
  const streakFreezes: number = data.streak_freezes ?? 0
  const lastActiveDate: string = data.last_active_date ?? ""

  if (lastActiveDate === today) {
    return { streak: streakCurrent, streakMax, froze: false }
  }

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0]!
  const isConsecutive = lastActiveDate === yesterday

  let newStreak: number
  let froze = false

  if (isConsecutive) {
    newStreak = streakCurrent + 1
  } else if (!isConsecutive && streakFreezes > 0) {
    // Auto-use a streak freeze to preserve streak
    newStreak = streakCurrent
    froze = true
    await userRef.update({ streak_freezes: FieldValue.increment(-1) })
  } else {
    newStreak = 1
  }

  const newMax = Math.max(streakMax, newStreak)

  await userRef.update({
    streak_current: newStreak,
    streak_max: newMax,
    last_active: FieldValue.serverTimestamp(),
    last_active_date: today,
  })

  revalidatePath("/dashboard")
  return { streak: newStreak, streakMax: newMax, froze }
}
