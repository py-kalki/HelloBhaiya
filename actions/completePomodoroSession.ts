"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

const POMODORO_XP = 30

export async function completePomodoroSession(taskId: string | null): Promise<{ xpEarned: number }> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const batch = db.batch()
  const userRef = db.collection("users").doc(uid)

  batch.update(userRef, {
    xp_total:     FieldValue.increment(POMODORO_XP),
    xp_this_week: FieldValue.increment(POMODORO_XP),
    last_active:  FieldValue.serverTimestamp(),
  })

  // Log the activity
  const activityRef = userRef.collection("activity_log").doc()
  batch.set(activityRef, {
    user_id: uid,
    title: "Focus Session Complete",
    desc: `Completed a 25-minute Pomodoro focus session.`,
    type: "study",
    created_at: FieldValue.serverTimestamp()
  })

  if (taskId) {
    const timetableRef = userRef.collection("timetable").doc("current")
    const doc = await timetableRef.get()
    if (doc.exists) {
      const tasks = doc.data()?.tasks ?? []
      const updated = tasks.map((t: { task_id: string; done: boolean }) =>
        t.task_id === taskId ? { ...t, done: true } : t
      )
      batch.update(timetableRef, { tasks: updated })
    }
  }

  await batch.commit()
  revalidatePath("/timetable")
  return { xpEarned: POMODORO_XP }
}
