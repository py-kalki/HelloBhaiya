"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import type { TestConfig } from "@/types/question"
import { randomUUID } from "crypto"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

export type SavedTemplate = {
  template_id: string
  name: string
  config: TestConfig
  created_at: unknown
  last_used_at: unknown
}

export async function saveTemplate(name: string, config: TestConfig): Promise<string> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  const templateId = randomUUID()
  const now = FieldValue.serverTimestamp()

  await db
    .collection("users")
    .doc(uid)
    .collection("templates")
    .doc(templateId)
    .set({
      template_id: templateId,
      name: name.trim(),
      config,
      created_at: now,
      last_used_at: now,
    })

  return templateId
}

export async function getTemplates(uid: string): Promise<SavedTemplate[]> {
  const db = getFirestore(adminApp)
  const snap = await db
    .collection("users")
    .doc(uid)
    .collection("templates")
    .orderBy("last_used_at", "desc")
    .limit(10)
    .get()

  return snap.docs.map((d) => d.data() as SavedTemplate)
}

export async function applyTemplate(templateId: string): Promise<void> {
  const uid = await verifySession()
  const db = getFirestore(adminApp)

  await db
    .collection("users")
    .doc(uid)
    .collection("templates")
    .doc(templateId)
    .update({ last_used_at: FieldValue.serverTimestamp() })
}
