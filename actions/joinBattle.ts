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

export type JoinBattleResult =
  | { ok: true;  battleId: string }
  | { ok: false; error: "NOT_FOUND" | "ALREADY_STARTED" | "SAME_USER" }

export async function joinBattle(inviteCode: string): Promise<JoinBattleResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  const snap = await db
    .collection("battles")
    .where("invite_code", "==", inviteCode.toUpperCase().trim())
    .where("status", "==", "WAITING")
    .limit(1)
    .get()

  if (snap.empty) return { ok: false, error: "NOT_FOUND" }

  const doc  = snap.docs[0]!
  const data = doc.data()

  if (data.player1_uid === uid) return { ok: false, error: "SAME_USER" }
  if (data.status !== "WAITING")  return { ok: false, error: "ALREADY_STARTED" }

  await doc.ref.update({
    player2_uid: uid,
    status:      "IN_PROGRESS",
  })

  return { ok: true, battleId: doc.id }
}
