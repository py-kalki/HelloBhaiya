import { describe, it, expect, vi } from "vitest"
import {
  toIST,
  toISTDateString,
  isToday,
  isYesterday,
  daysBetween,
  addDays,
  formatCountdown,
} from "./dateUtils"

describe("toIST", () => {
  it("shifts UTC time by +5:30", () => {
    const utc = new Date("2026-04-28T00:00:00Z")
    const ist = toIST(utc)
    expect(ist.getUTCHours()).toBe(5)
    expect(ist.getUTCMinutes()).toBe(30)
  })

  it("does not mutate the input date", () => {
    const utc = new Date("2026-04-28T00:00:00Z")
    toIST(utc)
    expect(utc.getUTCHours()).toBe(0)
  })
})

describe("toISTDateString", () => {
  it("returns YYYY-MM-DD in IST for a UTC midnight date", () => {
    const utc = new Date("2026-04-27T20:00:00Z") // 20:00 UTC = 01:30 IST next day
    expect(toISTDateString(utc)).toBe("2026-04-28")
  })

  it("returns IST date even when UTC date is behind", () => {
    const utc = new Date("2026-04-27T19:00:00Z") // 19:00 UTC = 00:30 IST next day
    expect(toISTDateString(utc)).toBe("2026-04-28")
  })

  it("uses current time when no arg passed", () => {
    const now = new Date("2026-04-28T10:00:00Z")
    vi.setSystemTime(now)
    expect(toISTDateString()).toBe("2026-04-28")
    vi.useRealTimers()
  })
})

describe("isToday", () => {
  it("returns true for today's IST date string", () => {
    const now = new Date("2026-04-28T10:00:00Z")
    vi.setSystemTime(now)
    expect(isToday("2026-04-28")).toBe(true)
    vi.useRealTimers()
  })

  it("returns false for yesterday", () => {
    const now = new Date("2026-04-28T10:00:00Z")
    vi.setSystemTime(now)
    expect(isToday("2026-04-27")).toBe(false)
    vi.useRealTimers()
  })
})

describe("isYesterday", () => {
  it("returns true for yesterday's date", () => {
    const now = new Date("2026-04-28T10:00:00Z")
    vi.setSystemTime(now)
    expect(isYesterday("2026-04-27")).toBe(true)
    vi.useRealTimers()
  })

  it("returns false for today", () => {
    const now = new Date("2026-04-28T10:00:00Z")
    vi.setSystemTime(now)
    expect(isYesterday("2026-04-28")).toBe(false)
    vi.useRealTimers()
  })
})

describe("daysBetween", () => {
  it("same day → 0", () => {
    const d = new Date("2026-04-28")
    expect(daysBetween(d, d)).toBe(0)
  })

  it("one week apart → 7", () => {
    const a = new Date("2026-04-21")
    const b = new Date("2026-04-28")
    expect(daysBetween(a, b)).toBe(7)
  })

  it("is symmetric (order doesn't matter)", () => {
    const a = new Date("2026-04-21")
    const b = new Date("2026-04-28")
    expect(daysBetween(a, b)).toBe(daysBetween(b, a))
  })
})

describe("addDays", () => {
  it("adds positive days", () => {
    const d = new Date("2026-04-28")
    const result = addDays(d, 5)
    expect(result.getUTCDate()).toBe(3)
    expect(result.getUTCMonth()).toBe(4) // May = 4
  })

  it("does not mutate input", () => {
    const d = new Date("2026-04-28")
    addDays(d, 5)
    expect(d.getUTCDate()).toBe(28)
  })

  it("adds 0 days → same date", () => {
    const d = new Date("2026-04-28")
    expect(addDays(d, 0).getTime()).toBe(d.getTime())
  })
})

describe("formatCountdown", () => {
  it("returns days label with plural", () => {
    const target = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const { label } = formatCountdown(target)
    expect(label).toMatch(/days/)
  })

  it("returns singular label when 1 day away", () => {
    const target = new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000)
    const { label } = formatCountdown(target)
    expect(label).toBe("1 day")
  })

  it("clamps to 0 for past dates", () => {
    const past = new Date(Date.now() - 1000)
    const { days } = formatCountdown(past)
    expect(days).toBe(0)
  })
})
