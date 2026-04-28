import type { Timestamp } from "firebase/firestore"

export type BattleStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED"

export type Battle = {
  battle_id:          string
  player1_uid:        string
  player2_uid:        string | null
  invite_code:        string
  status:             BattleStatus
  questions:          string[]          // question IDs (10)
  player1_answers:    Record<string, string | number>
  player2_answers:    Record<string, string | number>
  player1_progress:   number            // 0–100 (answers submitted / total)
  player2_progress:   number
  player1_accuracy:   number | null     // set on submission
  player2_accuracy:   number | null
  player1_time_seconds: number | null
  player2_time_seconds: number | null
  winner_uid:         string | null
  created_at:         Timestamp
  completed_at:       Timestamp | null
}

export type BattleSummary = {
  battleId:         string
  inviteCode:       string
  status:           BattleStatus
  isPlayer1:        boolean
  myAccuracy:       number | null
  oppAccuracy:      number | null
  myTimeSeconds:    number | null
  oppTimeSeconds:   number | null
  winnerUid:        string | null
  myUid:            string
  questionIds:      string[]
}
