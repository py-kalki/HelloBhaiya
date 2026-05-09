"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import type { ActivityLog } from "@/types/student"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function getActivityLog(limit = 10): Promise<(Omit<ActivityLog, "created_at"> & { created_at: number })[]> {
  try {
    const uid = await verifySession()
    const db = getFirestore(adminApp)

    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("activity_log")
      .orderBy("created_at", "desc")
      .limit(limit)
      .get()

    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        user_id: data.user_id,
        title: data.title,
        desc: data.desc,
        type: data.type,
        created_at: data.created_at?.toDate().getTime() ?? Date.now(),
      } as any
    })
  } catch (error) {
    console.error("Failed to fetch activity log:", error)
    return []
  }
}
