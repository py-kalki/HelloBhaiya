"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import { adminApp } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

const MIN_LEVEL_TO_UPLOAD = 15

export type UploadNoteInput = {
  title:        string
  subject:      "Biology" | "Physics" | "Chemistry" | "Mathematics"
  chapter_id:   string
  type:         "HANDWRITTEN" | "TYPED"
  pdfBase64:    string   // data URL base64
  creatorName:  string
  creatorHandle: string
}

export type UploadNoteResult =
  | { ok: true;  noteId: string }
  | { ok: false; error: "LEVEL_TOO_LOW" | "INVALID_INPUT" | "UPLOAD_FAILED" }

export async function uploadNote(input: UploadNoteInput): Promise<UploadNoteResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  // Level gate
  const userDoc = await db.collection("users").doc(uid).get()
  const level: number = userDoc.data()?.level ?? 1
  if (level < MIN_LEVEL_TO_UPLOAD) return { ok: false, error: "LEVEL_TOO_LOW" }

  if (!input.title.trim() || !input.chapter_id) return { ok: false, error: "INVALID_INPUT" }

  // Upload PDF to Firebase Storage
  try {
    const bucket   = getStorage(adminApp).bucket()
    const noteId   = randomUUID()
    const filePath = `notes/${noteId}/note.pdf`

    const base64Data = input.pdfBase64.replace(/^data:application\/pdf;base64,/, "")
    const buffer     = Buffer.from(base64Data, "base64")

    const file = bucket.file(filePath)
    await file.save(buffer, { contentType: "application/pdf", resumable: false })
    await file.makePublic()

    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

    await db.collection("notes").doc(noteId).set({
      note_id:          noteId,
      title:            input.title.trim(),
      subject:          input.subject,
      chapter_id:       input.chapter_id,
      type:             input.type,
      creator_name:     input.creatorName.trim(),
      creator_handle:   input.creatorHandle.trim(),
      creator_uid:      uid,
      source_url:       "",
      pdf_url:          pdfUrl,
      thumbnail_url:    "",
      aggregate_rating: 0,
      rating_count:     0,
      view_count:       0,
      is_flagged:       false,
      status:           "PENDING",    // admin must approve
      upload_date:      FieldValue.serverTimestamp(),
    })

    revalidatePath("/notes")
    return { ok: true, noteId }
  } catch {
    return { ok: false, error: "UPLOAD_FAILED" }
  }
}
