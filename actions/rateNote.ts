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

  const existing = await ratingRef.get()
  const batch = db.batch()

  batch.set(ratingRef, { rating, created_at: FieldValue.serverTimestamp() }, { merge: true })

  if (existing.exists) {
    const prev: number = existing.data()?.rating ?? 0
    const noteDoc = await noteRef.get()
    const ratingCount: number = noteDoc.data()?.rating_count ?? 1
    const aggRating:   number = noteDoc.data()?.aggregate_rating ?? prev

    const newAgg = (aggRating * ratingCount - prev + rating) / ratingCount
    batch.update(noteRef, { aggregate_rating: Math.round(newAgg * 10) / 10 })
  } else {
    batch.update(noteRef, {
      aggregate_rating: FieldValue.increment(rating),
      rating_count:     FieldValue.increment(1),
    })
  }

  await batch.commit()
  revalidatePath(`/notes/${noteId}`)
}
