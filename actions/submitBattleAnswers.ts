"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { calculateScore } from "@/lib/scoring"
import type { Question } from "@/types/question"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

const WIN_XP  = 250
const LOSS_XP = 75

export type SubmitBattleResult = {
  accuracy:    number
  winnerUid:   string | null
  xpEarned:    number
}

export async function submitBattleAnswers(
  battleId:        string,
  answers:         Record<string, string | number>,
  timeTakenSeconds: number
): Promise<SubmitBattleResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  const battleRef = db.collection("battles").doc(battleId)

  return db.runTransaction(async (tx) => {
    const battleSnap = await tx.get(battleRef)
    if (!battleSnap.exists) throw new Error("Battle not found")

    const battle = battleSnap.data()!
    const isPlayer1 = battle.player1_uid === uid
    const isPlayer2 = battle.player2_uid === uid
    if (!isPlayer1 && !isPlayer2) throw new Error("Not a participant")

    // Fetch questions to score the answers
    const questionDocs = await Promise.all(
      (battle.questions as string[]).map((qid) =>
        tx.get(db.collection("questions").doc(qid))
      )
    )
    const questions = questionDocs
      .filter((d) => d.exists)
      .map((d) => ({ question_id: d.id, ...d.data() } as Question))

    const result = calculateScore(questions, answers)
    const accuracy = result.accuracy

    const playerKey = isPlayer1 ? "player1" : "player2"
    const oppKey    = isPlayer1 ? "player2" : "player1"

    const updates: Record<string, unknown> = {
      [`${playerKey}_answers`]:      answers,
      [`${playerKey}_accuracy`]:     accuracy,
      [`${playerKey}_time_seconds`]: timeTakenSeconds,
      [`${playerKey}_progress`]:     100,
    }

    const oppAccuracy: number | null = battle[`${oppKey}_accuracy`] ?? null

    let winnerUid: string | null = null
    let xpEarned = LOSS_XP

    if (oppAccuracy !== null) {
      // Both submitted — resolve
      const oppTime: number = battle[`${oppKey}_time_seconds`] ?? Infinity

      winnerUid = accuracy > oppAccuracy
        ? uid
        : oppAccuracy > accuracy
        ? (isPlayer1 ? battle.player2_uid : battle.player1_uid)
        : timeTakenSeconds <= oppTime
        ? uid
        : (isPlayer1 ? battle.player2_uid : battle.player1_uid)

      xpEarned = winnerUid === uid ? WIN_XP : LOSS_XP

      updates.winner_uid   = winnerUid
      updates.status       = "COMPLETED"
      updates.completed_at = FieldValue.serverTimestamp()

      // Award XP to the winner (only the player who triggers resolution)
      const xpForWinner = winnerUid === uid ? WIN_XP : LOSS_XP
      tx.update(db.collection("users").doc(uid), {
        xp_total:     FieldValue.increment(xpForWinner),
        xp_this_week: FieldValue.increment(xpForWinner),
      })
    }

    tx.update(battleRef, updates)

    return { accuracy, winnerUid, xpEarned }
  })
}
