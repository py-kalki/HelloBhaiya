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

export async function markTopicComplete(
  chapterId: string,
  topicIndex: number,
  complete: boolean
): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const key = `topic_progress.${chapterId}.${topicIndex}`

  await db.collection("users").doc(uid).update({
    [key]: complete,
    last_active: FieldValue.serverTimestamp(),
  })

  revalidatePath("/roadmap")
}

export async function getTopicProgress(
  uid: string,
  chapterId: string
): Promise<Record<number, boolean>> {
  const db = getFirestore(adminApp)
  const doc = await db.collection("users").doc(uid).get()
  const data = doc.data()
  const progress: Record<string, boolean> = data?.["topic_progress"]?.[chapterId] ?? {}
  return Object.fromEntries(
    Object.entries(progress).map(([k, v]) => [Number(k), Boolean(v)])
  )
}
