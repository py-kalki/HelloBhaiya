import { getFirestore, Query, CollectionReference } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase/admin"
import type { Question, TestConfig } from "@/types/question"

type QuestionDoc = Question

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

async function fetchByDifficulty(
  baseRef: CollectionReference,
  config: TestConfig,
  difficulty: "EASY" | "MEDIUM" | "HARD",
  count: number,
  numericalCount: number,
): Promise<QuestionDoc[]> {
  if (count <= 0) return []

  const mcqCount = count - numericalCount
  const results: QuestionDoc[] = []

  // Fetch MCQ questions
  if (mcqCount > 0) {
    let q: Query = baseRef
      .where("difficulty", "==", difficulty)
      .where("type", "in", ["MCQ_SINGLE", "ASSERTION_REASON"])

    if (config.chapters.length > 0) {
      q = q.where("chapter_id", "in", config.chapters.slice(0, 10))
    }
    if (config.subjects.length > 0) {
      q = q.where("subject", "in", config.subjects)
    }
    if (config.mode === "PYQ") {
      q = q.where("is_pyq", "==", true)
      if (config.pyq_year_range) {
        q = q
          .where("pyq_year", ">=", config.pyq_year_range[0])
          .where("pyq_year", "<=", config.pyq_year_range[1])
      }
    }

    const snap = await q.limit(mcqCount * 3).get()
    const docs = snap.docs.map((d) => d.data() as QuestionDoc)
    results.push(...shuffle(docs).slice(0, mcqCount))
  }

  // Fetch NUMERICAL questions
  if (numericalCount > 0) {
    let q: Query = baseRef
      .where("difficulty", "==", difficulty)
      .where("type", "==", "NUMERICAL")

    if (config.chapters.length > 0) {
      q = q.where("chapter_id", "in", config.chapters.slice(0, 10))
    }
    if (config.subjects.length > 0) {
      q = q.where("subject", "in", config.subjects)
    }

    const snap = await q.limit(numericalCount * 3).get()
    const docs = snap.docs.map((d) => d.data() as QuestionDoc)
    results.push(...shuffle(docs).slice(0, numericalCount))
  }

  return results
}

export async function generateQuestionSet(
  config: TestConfig,
): Promise<{ questions: Question[]; warning?: string }> {
  const db = getFirestore(adminApp)
  const ref = db.collection("questions") as CollectionReference

  const total = config.question_count
  const easyTotal = Math.round((config.difficulty.easy / 100) * total)
  const mediumTotal = Math.round((config.difficulty.medium / 100) * total)
  const hardTotal = total - easyTotal - mediumTotal

  const numericalPct = config.numerical_pct / 100
  const easyNumerical = Math.round(easyTotal * numericalPct)
  const mediumNumerical = Math.round(mediumTotal * numericalPct)
  const hardNumerical = Math.round(hardTotal * numericalPct)

  const [easy, medium, hard] = await Promise.all([
    fetchByDifficulty(ref, config, "EASY", easyTotal, easyNumerical),
    fetchByDifficulty(ref, config, "MEDIUM", mediumTotal, mediumNumerical),
    fetchByDifficulty(ref, config, "HARD", hardTotal, hardNumerical),
  ])

  const combined = shuffle([...easy, ...medium, ...hard])

  if (combined.length < total) {
    return {
      questions: combined,
      warning: `Only ${combined.length} questions matched your filters (requested ${total})`,
    }
  }
  return { questions: combined }
}

export async function countAvailableQuestions(config: TestConfig): Promise<number> {
  const db = getFirestore(adminApp)
  let q: Query = db.collection("questions")

  if (config.chapters.length > 0) {
    q = q.where("chapter_id", "in", config.chapters.slice(0, 10))
  } else if (config.subjects.length > 0) {
    q = q.where("subject", "in", config.subjects)
  }

  if (config.mode === "PYQ") {
    q = q.where("is_pyq", "==", true)
    if (config.pyq_year_range) {
      q = q
        .where("pyq_year", ">=", config.pyq_year_range[0])
        .where("pyq_year", "<=", config.pyq_year_range[1])
    }
  }

  const snap = await q.count().get()
  return snap.data().count
}
