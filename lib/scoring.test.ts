import { describe, it, expect } from "vitest"
import {
  calculateScore,
  calculateXP,
  calculateChapterHealth,
  lookupLevel,
  rollingAccuracy,
} from "./scoring"
import type { Question } from "@/types/question"
import type { Timestamp } from "firebase/firestore"

const fakeTimestamp = {} as Timestamp

function makeQ(id: string, correct: string | number, subject = "Physics", chapter_id = "ch1"): Question {
  return {
    question_id: id,
    exam: "NEET",
    subject,
    unit: "Unit",
    chapter: "Chapter",
    chapter_id,
    topic: "Topic",
    type: "MCQ_SINGLE",
    difficulty: "MEDIUM",
    question_text: "Q?",
    options: ["A", "B", "C", "D"],
    correct_answer: correct,
    explanation: "",
    is_pyq: false,
    pyq_year: null,
    image_url: null,
    created_at: fakeTimestamp,
  }
}

const NEET_SCHEME = { correct: 4, wrong: -1, unattempted: 0 }

describe("calculateScore", () => {
  it("all correct", () => {
    const qs = [makeQ("q1", "A"), makeQ("q2", "B"), makeQ("q3", "C")]
    const answers = { q1: "A", q2: "B", q3: "C" }
    const r = calculateScore(qs, answers, NEET_SCHEME)
    expect(r.score).toBe(12)
    expect(r.correct).toBe(3)
    expect(r.wrong).toBe(0)
    expect(r.unattempted).toBe(0)
    expect(r.accuracy).toBe(100)
    expect(r.wrongQuestions).toHaveLength(0)
  })

  it("all wrong", () => {
    const qs = [makeQ("q1", "A"), makeQ("q2", "B")]
    const answers = { q1: "B", q2: "A" }
    const r = calculateScore(qs, answers, NEET_SCHEME)
    expect(r.score).toBe(-2)
    expect(r.wrong).toBe(2)
    expect(r.correct).toBe(0)
    expect(r.accuracy).toBe(0)
    expect(r.wrongQuestions).toEqual(["q1", "q2"])
  })

  it("all unattempted", () => {
    const qs = [makeQ("q1", "A"), makeQ("q2", "B")]
    const answers = {}
    const r = calculateScore(qs, answers, NEET_SCHEME)
    expect(r.score).toBe(0)
    expect(r.unattempted).toBe(2)
    expect(r.accuracy).toBe(0)
  })

  it("mixed answers", () => {
    const qs = [makeQ("q1", "A"), makeQ("q2", "B"), makeQ("q3", "C"), makeQ("q4", "D")]
    const answers = { q1: "A", q2: "A", q3: "C" }  // 2 correct, 1 wrong, 1 unattempted
    const r = calculateScore(qs, answers, NEET_SCHEME)
    expect(r.score).toBe(4 + 4 - 1)
    expect(r.correct).toBe(2)
    expect(r.wrong).toBe(1)
    expect(r.unattempted).toBe(1)
    expect(r.accuracy).toBe(67) // 2/3 attempted correct
  })

  it("tracks per-subject accuracy", () => {
    const qs = [
      makeQ("q1", "A", "Physics", "ph1"),
      makeQ("q2", "B", "Biology", "bio1"),
      makeQ("q3", "C", "Physics", "ph1"),
    ]
    const answers = { q1: "A", q2: "B", q3: "D" } // Physics: 1/2, Bio: 1/1
    const r = calculateScore(qs, answers, NEET_SCHEME)
    expect(r.subjectAccuracy["Physics"]).toBe(50)
    expect(r.subjectAccuracy["Biology"]).toBe(100)
  })

  it("maxScore is questions × correct_marks", () => {
    const qs = [makeQ("q1", "A"), makeQ("q2", "B")]
    const r = calculateScore(qs, {}, NEET_SCHEME)
    expect(r.maxScore).toBe(8)
  })
})

describe("calculateXP", () => {
  it("base XP only — low accuracy, no timer", () => {
    expect(calculateXP(50, 1000, null)).toBe(100)
  })

  it("accuracy > 80% gives +200 bonus", () => {
    expect(calculateXP(85, 1000, null)).toBe(300)
  })

  it("accuracy 60-80% gives +100 bonus", () => {
    expect(calculateXP(70, 1000, null)).toBe(200)
  })

  it("speed bonus when under 70% of timer", () => {
    // 60min timer → 3600s, threshold = 3600 × 0.7 = 2520s
    expect(calculateXP(55, 2000, 60)).toBe(150)
  })

  it("no speed bonus when over 70% of timer", () => {
    expect(calculateXP(55, 3000, 60)).toBe(100)
  })

  it("speed + accuracy bonuses stack", () => {
    expect(calculateXP(85, 2000, 60)).toBe(350)
  })
})

describe("calculateChapterHealth", () => {
  it("high accuracy + practiced today = high health", () => {
    const h = calculateChapterHealth(90, 0, 30)
    expect(h).toBeGreaterThanOrEqual(80)
  })

  it("decays with days since practice", () => {
    const fresh = calculateChapterHealth(80, 0, 20)
    const stale = calculateChapterHealth(80, 14, 20)
    expect(fresh).toBeGreaterThan(stale)
  })

  it("volume capped at 30 questions", () => {
    const at30 = calculateChapterHealth(80, 0, 30)
    const at100 = calculateChapterHealth(80, 0, 100)
    expect(at30).toBe(at100)
  })
})

describe("lookupLevel", () => {
  it("0 XP → Rookie level 1", () => {
    const l = lookupLevel(0)
    expect(l.level).toBe(1)
    expect(l.title).toBe("Rookie")
  })

  it("2000 XP → Atom level 5", () => {
    const l = lookupLevel(2000)
    expect(l.level).toBe(5)
  })

  it("100000 XP → NEET Legend level 30", () => {
    const l = lookupLevel(100_000)
    expect(l.level).toBe(30)
  })

  it("boundary: 1999 XP → Rookie", () => {
    expect(lookupLevel(1999).level).toBe(1)
  })

  it("boundary: 45000 XP → Scholar", () => {
    expect(lookupLevel(45_000).level).toBe(20)
  })
})

describe("rollingAccuracy", () => {
  it("no existing → return new", () => {
    expect(rollingAccuracy(80, undefined)).toBe(80)
  })

  it("blends with weight 0.3", () => {
    const result = rollingAccuracy(100, 60, 0.3)
    expect(result).toBe(Math.round(60 * 0.7 + 100 * 0.3))
  })

  it("custom weight applied", () => {
    const result = rollingAccuracy(80, 40, 0.5)
    expect(result).toBe(60)
  })
})
