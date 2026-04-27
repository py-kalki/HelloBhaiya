import { describe, it, expect, vi } from "vitest"
import { updateSM2, isOverdue, urgencyScore } from "./sm2"
import type { SM2Card } from "@/types/question"

function makeCard(overrides: Partial<SM2Card> = {}): SM2Card {
  return {
    interval: 1,
    ease_factor: 2.5,
    repetitions: 0,
    next_review: new Date(),
    ...overrides,
  }
}

describe("updateSM2 — low accuracy (<60%) resets card", () => {
  it("resets repetitions to 0", () => {
    const card = makeCard({ repetitions: 3, ease_factor: 2.5 })
    const updated = updateSM2(card, 50)
    expect(updated.repetitions).toBe(0)
    expect(updated.interval).toBe(1)
  })

  it("reduces ease factor by 0.2", () => {
    const card = makeCard({ ease_factor: 2.5 })
    const updated = updateSM2(card, 40)
    expect(updated.ease_factor).toBeCloseTo(2.3)
  })

  it("never drops ease factor below 1.3", () => {
    const card = makeCard({ ease_factor: 1.3 })
    const updated = updateSM2(card, 30)
    expect(updated.ease_factor).toBe(1.3)
  })

  it("next review is tomorrow", () => {
    const now = new Date("2026-04-27T12:00:00Z")
    vi.setSystemTime(now)
    const card = makeCard()
    const updated = updateSM2(card, 55)
    const diff = updated.next_review.getTime() - now.getTime()
    expect(diff).toBeGreaterThanOrEqual(86_400_000 - 1000)
    expect(diff).toBeLessThanOrEqual(86_400_000 + 1000)
    vi.useRealTimers()
  })
})

describe("updateSM2 — medium accuracy (60-80%) holds interval", () => {
  it("keeps same interval", () => {
    const card = makeCard({ interval: 6, repetitions: 2 })
    const updated = updateSM2(card, 70)
    expect(updated.interval).toBe(6)
  })

  it("keeps same repetitions and ease factor", () => {
    const card = makeCard({ repetitions: 2, ease_factor: 2.2 })
    const updated = updateSM2(card, 75)
    expect(updated.repetitions).toBe(2)
    expect(updated.ease_factor).toBe(2.2)
  })
})

describe("updateSM2 — high accuracy (≥80%) advances", () => {
  it("first repetition → interval 1", () => {
    const card = makeCard({ repetitions: 0 })
    const updated = updateSM2(card, 90)
    expect(updated.interval).toBe(1)
    expect(updated.repetitions).toBe(1)
  })

  it("second repetition → interval 6", () => {
    const card = makeCard({ repetitions: 1, interval: 1 })
    const updated = updateSM2(card, 85)
    expect(updated.interval).toBe(6)
    expect(updated.repetitions).toBe(2)
  })

  it("later repetitions multiply by ease factor", () => {
    const card = makeCard({ repetitions: 2, interval: 6, ease_factor: 2.5 })
    const updated = updateSM2(card, 95)
    expect(updated.interval).toBe(Math.round(6 * 2.5))
    expect(updated.repetitions).toBe(3)
  })

  it("increases ease factor by 0.1", () => {
    const card = makeCard({ ease_factor: 2.4 })
    const updated = updateSM2(card, 90)
    expect(updated.ease_factor).toBeCloseTo(2.5)
  })
})

describe("isOverdue", () => {
  it("returns true when next_review is past", () => {
    const card = makeCard({ next_review: new Date(Date.now() - 1000) })
    expect(isOverdue(card)).toBe(true)
  })

  it("returns false when next_review is future", () => {
    const card = makeCard({ next_review: new Date(Date.now() + 86_400_000) })
    expect(isOverdue(card)).toBe(false)
  })
})

describe("urgencyScore", () => {
  it("higher when more overdue", () => {
    const card1 = makeCard({ next_review: new Date(Date.now() - 86_400_000) })
    const card2 = makeCard({ next_review: new Date(Date.now() - 2 * 86_400_000) })
    expect(urgencyScore(card2, 50)).toBeGreaterThan(urgencyScore(card1, 50))
  })

  it("higher when lower accuracy", () => {
    const card = makeCard({ next_review: new Date(Date.now() - 86_400_000) })
    expect(urgencyScore(card, 30)).toBeGreaterThan(urgencyScore(card, 80))
  })

  it("zero when not overdue", () => {
    const card = makeCard({ next_review: new Date(Date.now() + 86_400_000) })
    expect(urgencyScore(card, 50)).toBe(0)
  })
})
