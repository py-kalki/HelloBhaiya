import type { Timestamp } from "firebase/firestore"

export type QuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTI"
  | "NUMERICAL"
  | "ASSERTION_REASON"

export type Difficulty = "EASY" | "MEDIUM" | "HARD"
export type TestMode =
  | "CUSTOM"
  | "PYQ"
  | "RAPID_FIRE"
  | "MISTAKE_REPLAY"
  | "REVISION"
  | "BATTLE"

export type TestStatus = "IN_PROGRESS" | "COMPLETED"

export type Question = {
  question_id: string
  exam: "NEET" | "JEE_MAINS" | "JEE_ADV"
  subject: string
  unit: string
  chapter: string
  chapter_id: string
  topic: string
  type: QuestionType
  difficulty: Difficulty
  question_text: string
  options: string[]
  correct_answer: string | number
  explanation: string
  is_pyq: boolean
  pyq_year: number | null
  image_url: string | null
  created_at: Timestamp
}

export type TestConfig = {
  exam: "NEET" | "JEE_MAINS" | "JEE_ADV"
  subjects: string[]
  chapters: string[]
  difficulty: { easy: number; medium: number; hard: number }
  numerical_pct: number
  question_count: number
  timer_minutes: number | null
  mode: TestMode
  pyq_year_range?: [number, number]
}

export type TestSession = {
  test_id: string
  created_at: Timestamp
  completed_at: Timestamp | null
  status: TestStatus
  mode: TestMode
  config: TestConfig
  questions: string[]
  answers: Record<string, string | number>
  flagged: string[]
  score: number
  max_score: number
  accuracy: number
  subject_accuracy: Record<string, number>
  chapter_accuracy: Record<string, number>
  wrong_questions: string[]
  time_taken_seconds: number
  xp_earned: number
  pauses_used: number
}

export type ScoreResult = {
  score: number
  maxScore: number
  correct: number
  wrong: number
  unattempted: number
  accuracy: number
  wrongQuestions: string[]
  subjectAccuracy: Record<string, number>
  chapterAccuracy: Record<string, number>
}

export type SM2Card = {
  interval: number
  ease_factor: number
  repetitions: number
  next_review: Date
}
