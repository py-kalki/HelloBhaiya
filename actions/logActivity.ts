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

export async function logActivity(title: string, desc: string, type: "test" | "study" | "achievement" | "goal") {
  try {
    const uid = await verifySession()
    const db = getFirestore(adminApp)

    await db.collection("users").doc(uid).collection("activity_log").add({
      user_id: uid,
      title,
      desc,
      type,
      created_at: FieldValue.serverTimestamp()
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Failed to log activity:", error)
  }
}
