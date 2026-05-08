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

type JoinClassResult =
  | { ok: true;  institutionId: string; classId: string; className: string }
  | { ok: false; error: "NOT_FOUND" | "ALREADY_JOINED" }

export async function joinClass(joinCode: string): Promise<JoinClassResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  // Query all institution classes by join_code — requires composite index
  const snaps = await db
    .collectionGroup("classes")
    .where("join_code", "==", joinCode.trim().toUpperCase())
    .limit(1)
    .get()

  if (snaps.empty) return { ok: false, error: "NOT_FOUND" }

  const classDoc = snaps.docs[0]!
  const classData = classDoc.data()

  const studentUids: string[] = classData.student_uids ?? []
  if (studentUids.includes(uid)) return { ok: false, error: "ALREADY_JOINED" }

  await classDoc.ref.update({
    student_uids: FieldValue.arrayUnion(uid),
  })

  const institutionId = classDoc.ref.parent.parent!.id
  revalidatePath("/dashboard")

  return {
    ok: true,
    institutionId,
    classId: classDoc.id,
    className: classData.name as string,
  }
}
