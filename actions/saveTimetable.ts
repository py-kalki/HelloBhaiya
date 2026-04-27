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

export type TimetableTask = {
  task_id: string
  date: string
  subject: string
  chapter_id: string
  chapter_name: string
  duration_minutes: number
  done: boolean
  order: number
}

export type Timetable = {
  created_at: number
  exam_date: string
  start_date: string
  study_hours_per_day: number
  rest_days: number[]
  tasks: TimetableTask[]
}

export async function saveTimetable(timetable: Omit<Timetable, "created_at">): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  await db
    .collection("users")
    .doc(uid)
    .collection("timetable")
    .doc("current")
    .set({ ...timetable, created_at: FieldValue.serverTimestamp() })
  revalidatePath("/timetable")
}

export async function markTaskDone(taskId: string, done: boolean): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const ref = db.collection("users").doc(uid).collection("timetable").doc("current")
  const doc = await ref.get()
  if (!doc.exists) return

  const tasks: TimetableTask[] = doc.data()?.tasks ?? []
  const updated = tasks.map((t) => (t.task_id === taskId ? { ...t, done } : t))
  await ref.update({ tasks: updated })
  revalidatePath("/timetable")
}
