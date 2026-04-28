"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

function generateJoinCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

type CreateClassInput = {
  institutionId: string
  className:     string
}

type CreateClassResult =
  | { ok: true;  classId: string; joinCode: string }
  | { ok: false; error: "UNAUTHORIZED" | "NOT_FOUND" | "INVALID_INPUT" }

export async function createClass(input: CreateClassInput): Promise<CreateClassResult> {
  const uid = await verifySession()
  if (!input.className.trim() || !input.institutionId) {
    return { ok: false, error: "INVALID_INPUT" }
  }

  const db = getFirestore(adminApp)
  const instRef = db.collection("institutions").doc(input.institutionId)
  const instSnap = await instRef.get()

  if (!instSnap.exists) return { ok: false, error: "NOT_FOUND" }
  if (instSnap.data()?.admin_uid !== uid) return { ok: false, error: "UNAUTHORIZED" }

  const classId  = randomUUID()
  const joinCode = generateJoinCode()

  await db
    .collection("institutions")
    .doc(input.institutionId)
    .collection("classes")
    .doc(classId)
    .set({
      class_id:     classId,
      name:         input.className.trim(),
      join_code:    joinCode,
      student_uids: [],
      created_at:   FieldValue.serverTimestamp(),
    })

  revalidatePath("/institution/dashboard")
  return { ok: true, classId, joinCode }
}
