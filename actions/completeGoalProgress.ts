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

export async function completeGoalProgress(questionsCompleted: number): Promise<{
  nowComplete: boolean
  xpAwarded: number
}> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const today = toISTDateString()

  const goalRef = db
    .collection("users")
    .doc(uid)
    .collection("dailyGoal")
    .doc("current")
  const goalSnap = await goalRef.get()

  if (!goalSnap.exists) return { nowComplete: false, xpAwarded: 0 }

  const goal = goalSnap.data()!
  if (goal.date !== today || goal.complete) return { nowComplete: goal.complete, xpAwarded: 0 }

  const newDone = (goal.done ?? 0) + questionsCompleted
  const nowComplete = newDone >= goal.target

  await goalRef.update({
    done: newDone,
    complete: nowComplete,
  })

  // Award bonus XP on completion
  let xpAwarded = 0
  if (nowComplete) {
    xpAwarded = 150
    await db
      .collection("users")
      .doc(uid)
      .update({
        xp_total: FieldValue.increment(xpAwarded),
        xp_this_week: FieldValue.increment(xpAwarded),
      })
  }

  revalidatePath("/dashboard")
  return { nowComplete, xpAwarded }
}
