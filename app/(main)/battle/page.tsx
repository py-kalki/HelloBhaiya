import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import type { Battle } from "@/types/battle"
import type { Question } from "@/types/question"
import { MatchmakingScreen } from "@/components/battle/MatchmakingScreen"
import { BattleArena } from "@/components/battle/BattleArena"
import { BattleResults } from "@/components/battle/BattleResults"
import type { BattleSummary } from "@/types/battle"

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

interface PageProps {
  searchParams: Promise<{ id?: string; done?: string }>
}

export default async function BattlePage({ searchParams }: PageProps) {
  const { id: battleId, done } = await searchParams
  const decoded = await getUser()
  const uid = decoded.uid

  if (!battleId) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <MatchmakingScreen />
      </div>
    )
  }

  const db  = getFirestore(adminApp)
  const ref = db.collection("battles").doc(battleId)
  const battleSnap = await ref.get()

  if (!battleSnap.exists) notFound()

  const battle = battleSnap.data() as Battle
  const isPlayer1 = battle.player1_uid === uid
  const isPlayer2 = battle.player2_uid === uid

  if (!isPlayer1 && !isPlayer2) notFound()

  // Waiting for opponent
  if (battle.status === "WAITING") {
    return (
      <div className="min-h-screen bg-background pb-24 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-text-primary font-semibold">Waiting for opponent…</p>
        <p className="text-sm text-text-secondary">
          Share code <span className="font-mono text-accent font-bold">{battle.invite_code}</span>
        </p>
      </div>
    )
  }

  // Battle complete → show results
  if (battle.status === "COMPLETED" || done === "1") {
    const summary: BattleSummary = {
      battleId,
      inviteCode:     battle.invite_code,
      status:         battle.status,
      isPlayer1,
      myAccuracy:     isPlayer1 ? battle.player1_accuracy : battle.player2_accuracy,
      oppAccuracy:    isPlayer1 ? battle.player2_accuracy : battle.player1_accuracy,
      myTimeSeconds:  isPlayer1 ? battle.player1_time_seconds : battle.player2_time_seconds,
      oppTimeSeconds: isPlayer1 ? battle.player2_time_seconds : battle.player1_time_seconds,
      winnerUid:      battle.winner_uid,
      myUid:          uid,
      questionIds:    battle.questions,
    }

    return (
      <div className="min-h-screen bg-background pb-24">
        <BattleResults summary={summary} />
      </div>
    )
  }

  // In progress — load questions and render arena
  const questionDocs = await Promise.all(
    battle.questions.map((qid) => db.collection("questions").doc(qid).get())
  )
  const questions: Question[] = questionDocs
    .filter((d) => d.exists)
    .map((d) => ({ question_id: d.id, ...d.data() } as Question))

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <p className="text-text-secondary text-sm">Failed to load battle questions.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <BattleArena
        battleId={battleId}
        isPlayer1={isPlayer1}
        questions={questions}
        initialData={battle}
      />
    </div>
  )
}
