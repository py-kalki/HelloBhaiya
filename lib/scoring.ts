import type { Question, ScoreResult } from "@/types/question"
import type { MarkingScheme } from "@/types/student"

const NEET_DEFAULT: MarkingScheme = { correct: 4, wrong: -1, unattempted: 0 }

export const MARKING_SCHEMES: Record<string, MarkingScheme> = {
  NEET:      { correct: 4, wrong: -1, unattempted: 0 },
  JEE_MAINS: { correct: 4, wrong: -1, unattempted: 0 },
  JEE_ADV:   { correct: 4, wrong: -2, unattempted: 0 },
}

export function schemeForExam(exam: string): MarkingScheme {
  return MARKING_SCHEMES[exam] ?? MARKING_SCHEMES["NEET"]!
}

// JEE MCQ_MULTI scoring: partial marking for ADV, all-or-nothing for MAINS
function scoreMCQMulti(
  answer: string | number | undefined | null,
  correctAnswer: string | number,
  exam: string
): number {
  if (answer === undefined || answer === null || answer === "") return 0

  const selected = String(answer).split(",").map((s) => s.trim()).sort()
  const correct  = String(correctAnswer).split(",").map((s) => s.trim()).sort()

  const hasWrong = selected.some((s) => !correct.includes(s))
  if (hasWrong) return -2

  const allCorrect =
    selected.length === correct.length && correct.every((c) => selected.includes(c))
  if (allCorrect) return 4

  if (exam === "JEE_ADV") return selected.filter((s) => correct.includes(s)).length
  return 0 // JEE_MAINS: partial with no wrong = 0
}

export function calculateScore(
  questions: Question[],
  answers: Record<string, string | number>,
  scheme: MarkingScheme = NEET_DEFAULT,
  exam = "NEET"
): ScoreResult {
  let score = 0
  let correct = 0, wrong = 0, unattempted = 0
  const wrongQuestions: string[] = []
  const subjectAccuracy: Record<string, { correct: number; attempted: number }> = {}
  const chapterAccuracy: Record<string, { correct: number; attempted: number }> = {}

  for (const q of questions) {
    const answer = answers[q.question_id]
    const isUnattempted = answer === undefined || answer === null || answer === ""

    let questionScore: number
    let isCorrect: boolean

    if (isUnattempted) {
      questionScore = scheme.unattempted
      isCorrect = false
      unattempted++
    } else if (q.type === "MCQ_MULTI" && (exam === "JEE_MAINS" || exam === "JEE_ADV")) {
      questionScore = scoreMCQMulti(answer, q.correct_answer, exam)
      isCorrect = questionScore > 0
      if (questionScore < 0) {
        wrong++
        wrongQuestions.push(q.question_id)
      } else {
        correct++
      }
    } else {
      // answers are stored as option labels (A/B/C/D) — resolve to actual text
      const LABELS = ["A", "B", "C", "D"]
      const labelIndex = LABELS.indexOf(String(answer))
      const resolvedAnswer = labelIndex !== -1 && q.options?.[labelIndex] !== undefined
        ? q.options[labelIndex]
        : answer

      // correct_answer might also be a label in old data — resolve it too just in case
      const correctLabelIndex = LABELS.indexOf(String(q.correct_answer))
      const resolvedCorrect = correctLabelIndex !== -1 && q.options?.[correctLabelIndex] !== undefined
        ? q.options[correctLabelIndex]
        : q.correct_answer

      isCorrect = String(resolvedAnswer).trim() === String(resolvedCorrect).trim()

      if (isCorrect) {
        questionScore = scheme.correct
        correct++
      } else {
        questionScore = scheme.wrong
        wrong++
        wrongQuestions.push(q.question_id)
      }
    }

    score += questionScore

    if (!isUnattempted) {
      const sub = subjectAccuracy[q.subject] ?? { correct: 0, attempted: 0 }
      sub.attempted++
      if (isCorrect) sub.correct++
      subjectAccuracy[q.subject] = sub

      const chp = chapterAccuracy[q.chapter_id] ?? { correct: 0, attempted: 0 }
      chp.attempted++
      if (isCorrect) chp.correct++
      chapterAccuracy[q.chapter_id] = chp
    }
  }

  const attempted = correct + wrong
  const toPercent = (obj: Record<string, { correct: number; attempted: number }>) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0,
      ])
    )

  return {
    score,
    maxScore: questions.length * scheme.correct,
    correct,
    wrong,
    unattempted,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    wrongQuestions,
    subjectAccuracy: toPercent(subjectAccuracy),
    chapterAccuracy: toPercent(chapterAccuracy),
  }
}

export function calculateXP(
  accuracy: number,
  timeTakenSeconds: number,
  timerMinutes: number | null
): number {
  const base = 100
  const accuracyBonus = accuracy > 80 ? 200 : accuracy >= 60 ? 100 : 0
  const speedBonus =
    timerMinutes !== null && timeTakenSeconds < timerMinutes * 60 * 0.7 ? 50 : 0
  return base + accuracyBonus + speedBonus
}

export function calculateChapterHealth(
  accuracy: number,
  daysSinceLastPractice: number,
  totalQuestionsAttempted: number
): number {
  const recency = Math.max(0, 100 - daysSinceLastPractice * (100 / 14))
  const volume  = Math.min(totalQuestionsAttempted / 30, 1) * 100
  return Math.round(accuracy * 0.6 + recency * 0.2 + volume * 0.2)
}

const LEVEL_THRESHOLDS: Array<{ level: number; title: string; xp: number; unlock: string }> = [
  { level: 30, title: "NEET Legend", xp: 100_000, unlock: "Profile crown, early access" },
  { level: 20, title: "Scholar",     xp:  45_000, unlock: "Custom timetable templates, AI Doubt Solver" },
  { level: 15, title: "Catalyst",    xp:  20_000, unlock: "Advanced roadmap, community upload" },
  { level: 10, title: "Molecule",    xp:   8_000, unlock: "Battle Mode, detailed analytics" },
  { level:  5, title: "Atom",        xp:   2_000, unlock: "PYQ mode, streak badges" },
  { level:  1, title: "Rookie",      xp:       0, unlock: "Basic test engine" },
]

export function lookupLevel(xp: number): { level: number; title: string; unlock: string } {
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xp) return t
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]!
}

export function rollingAccuracy(
  newAccuracy: number,
  existing: number | undefined,
  weight = 0.3
): number {
  if (existing === undefined) return newAccuracy
  return Math.round(existing * (1 - weight) + newAccuracy * weight)
}
