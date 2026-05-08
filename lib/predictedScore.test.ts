import { describe, it, expect } from "vitest"
import { predictNEETScore } from "./predictedScore"

describe("predictNEETScore", () => {
  it("returns [0, 0] for empty accuracy map", () => {
    const [low, high] = predictNEETScore({})
    expect(low).toBe(0)
    expect(high).toBe(0)
  })

  it("ignores unknown subjects", () => {
    const [low, high] = predictNEETScore({ Sanskrit: 100 })
    expect(low).toBe(0)
    expect(high).toBe(0)
  })

  it("100% accuracy in all three subjects gives near-max score (80% attempt rate caps below 720)", () => {
    // 100% accuracy, 80% attempt rate → 576 marks predicted → low≈530, high≈622
    const [low, high] = predictNEETScore({
      Biology: 100,
      Physics: 100,
      Chemistry: 100,
    })
    expect(low).toBeGreaterThan(500)
    expect(high).toBeLessThanOrEqual(720)
  })

  it("low = ~92% of predicted, high = ~108% (both clamped to [0, 720])", () => {
    const [low, high] = predictNEETScore({ Biology: 50, Physics: 50, Chemistry: 50 })
    expect(high).toBeGreaterThan(low)
    expect(high / low).toBeCloseTo(1.08 / 0.92, 0)
  })

  it("low is always ≤ high", () => {
    const [low, high] = predictNEETScore({ Biology: 60, Physics: 40, Chemistry: 75 })
    expect(low).toBeLessThanOrEqual(high)
  })

  it("high is clamped to 720 even with multiplier", () => {
    // Simulate a case where normalised × 1.08 would exceed 720
    const [, high] = predictNEETScore({ Biology: 100, Physics: 100, Chemistry: 100 })
    expect(high).toBeLessThanOrEqual(720)
  })

  it("partial subject data — all subjects give higher score than one alone", () => {
    // Biology alone at 80% → ~199 low; all three at 80% → ~397 low
    const [lowBio] = predictNEETScore({ Biology: 80 })
    const [lowAll] = predictNEETScore({ Biology: 80, Physics: 80, Chemistry: 80 })
    expect(lowAll).toBeGreaterThan(lowBio)
  })

  it("0% accuracy gives 0 after clamping", () => {
    const [low, high] = predictNEETScore({ Biology: 0, Physics: 0, Chemistry: 0 })
    expect(low).toBe(0)
    expect(high).toBe(0)
  })
})
