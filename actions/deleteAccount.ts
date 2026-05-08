"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
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

  // Delete sub-collections (tests, templates, timetable)
  const subcollections = ["tests", "templates", "timetable"]
  for (const sub of subcollections) {
    const snap = await db.collection("users").doc(uid).collection(sub).limit(500).get()
    if (snap.docs.length > 0) {
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }
  }

  // Delete dailyGoal document
  await db.collection("users").doc(uid).collection("dailyGoal").doc("current").delete()

  // Remove from institution classes (GDPR: remove references to deleted user)
  const classSnaps = await db
    .collectionGroup("classes")
    .where("student_uids", "array-contains", uid)
    .limit(20)
    .get()

  if (!classSnaps.empty) {
    const batch = db.batch()
    classSnaps.docs.forEach((d) =>
      batch.update(d.ref, { student_uids: FieldValue.arrayRemove(uid) })
    )
    await batch.commit()
  }

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

  // Delete Firebase Auth user (this also invalidates all tokens)
  await auth.deleteUser(uid)

  // Clear session cookie
  ;(await cookies()).delete("session")

  redirect("/login")
}
