"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import { adminApp } from "@/lib/firebase/admin"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

function makeInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export type CreateBattleResult = {
  battleId:   string
  inviteCode: string
}

export async function createBattle(): Promise<CreateBattleResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  // Sample 10 questions across subjects from the question bank
  const snaps = await Promise.all([
    db.collection("questions").where("exam", "==", "NEET").where("subject", "==", "Biology").limit(4).get(),
    db.collection("questions").where("exam", "==", "NEET").where("subject", "==", "Physics").limit(3).get(),
    db.collection("questions").where("exam", "==", "NEET").where("subject", "==", "Chemistry").limit(3).get(),
  ])

  const questionIds = snaps.flatMap((s) => s.docs.map((d) => d.id))

  if (questionIds.length < 5) {
    throw new Error("Not enough questions in the bank to start a battle.")
  }

  const battleId   = randomUUID()
  const inviteCode = makeInviteCode()

  await db.collection("battles").doc(battleId).set({
    battle_id:            battleId,
    player1_uid:          uid,
    player2_uid:          null,
    invite_code:          inviteCode,
    status:               "WAITING",
    questions:            questionIds,
    player1_answers:      {},
    player2_answers:      {},
    player1_progress:     0,
    player2_progress:     0,
    player1_accuracy:     null,
    player2_accuracy:     null,
    player1_time_seconds: null,
    player2_time_seconds: null,
    winner_uid:           null,
    created_at:           FieldValue.serverTimestamp(),
    completed_at:         null,
  })

  return { battleId, inviteCode }
}
