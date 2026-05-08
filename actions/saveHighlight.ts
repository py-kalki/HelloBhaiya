"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export type HighlightData = {
  page: number
  x: number
  y: number
  width: number
  height: number
  colour: "yellow" | "green" | "pink"
  created_at: number
}

export async function saveHighlight(
  noteId: string,
  highlight: Omit<HighlightData, "created_at">
): Promise<string> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const ref = db
    .collection("users")
    .doc(uid)
    .collection("notes_highlights")
    .doc(noteId)

  const doc = await ref.get()
  const existing: HighlightData[] = doc.exists ? (doc.data()?.highlights ?? []) : []

  const newHighlight: HighlightData = { ...highlight, created_at: Date.now() }
  const id = `h-${Date.now()}`

  await ref.set(
    { highlights: [...existing, { ...newHighlight, id }] },
    { merge: true }
  )

  return id
}

export async function deleteHighlight(noteId: string, createdAt: number): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const ref = db
    .collection("users")
    .doc(uid)
    .collection("notes_highlights")
    .doc(noteId)

  const doc = await ref.get()
  if (!doc.exists) return

  const existing: HighlightData[] = doc.data()?.highlights ?? []
  await ref.set({ highlights: existing.filter((h) => h.created_at !== createdAt) })
}

export async function getHighlights(noteId: string): Promise<HighlightData[]> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const doc = await db
    .collection("users")
    .doc(uid)
    .collection("notes_highlights")
    .doc(noteId)
    .get()

  if (!doc.exists) return []
  return doc.data()?.highlights ?? []
}
