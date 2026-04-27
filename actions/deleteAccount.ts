"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { redirect } from "next/navigation"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export async function deleteAccount(): Promise<never> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const auth = getAuth(adminApp)

  // Delete sub-collections (tests, templates, dailyGoal)
  const subcollections = ["tests", "templates", "timetable"]
  for (const sub of subcollections) {
    const snap = await db.collection("users").doc(uid).collection(sub).limit(500).get()
    const batch = db.batch()
    snap.docs.forEach((d) => batch.delete(d.ref))
    if (snap.docs.length > 0) await batch.commit()
  }

  // Delete the dailyGoal document
  await db.collection("users").doc(uid).collection("dailyGoal").doc("current").delete()

  // Delete user document
  await db.collection("users").doc(uid).delete()

  // Delete leaderboard entry
  await db
    .collection("leaderboard")
    .doc("weekly")
    .collection("entries")
    .doc(uid)
    .delete()

  // Revoke all sessions
  await auth.revokeRefreshTokens(uid)

  // Delete auth user
  await auth.deleteUser(uid)

  // Clear session cookie
  ;(await cookies()).delete("session")

  redirect("/login")
}
