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

export async function rateNote(noteId: string, rating: number): Promise<void> {
  if (rating < 1 || rating > 5) throw new Error("Rating must be 1–5")

  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const ratingRef = db.collection("notes").doc(noteId).collection("ratings").doc(uid)
  const noteRef   = db.collection("notes").doc(noteId)

  await db.runTransaction(async (tx) => {
    const [existingSnap, noteSnap] = await Promise.all([
      tx.get(ratingRef),
      tx.get(noteRef),
    ])

    const ratingCount: number = noteSnap.data()?.rating_count ?? 0
    const aggRating:   number = noteSnap.data()?.aggregate_rating ?? 0

    tx.set(ratingRef, { rating, created_at: FieldValue.serverTimestamp() }, { merge: true })

    if (existingSnap.exists) {
      const prev: number = existingSnap.data()?.rating ?? 0
      const count = Math.max(ratingCount, 1)
      const newAgg = (aggRating * count - prev + rating) / count
      tx.update(noteRef, { aggregate_rating: Math.round(newAgg * 10) / 10 })
    } else {
      const newCount = ratingCount + 1
      const newAgg = (aggRating * ratingCount + rating) / newCount
      tx.update(noteRef, {
        aggregate_rating: Math.round(newAgg * 10) / 10,
        rating_count:     FieldValue.increment(1),
      })
    }
  })
  revalidatePath(`/notes/${noteId}`)
}
