import { describe, it, expect } from "vitest"
import {
  getEntitlement,
  isPro,
  isInstitution,
  canUseDoubtSolver,
} from "./entitlements"

describe("getEntitlement", () => {
  it("FREE user has 5 doubt solver uses", () => {
    expect(getEntitlement("doubtSolverDailyLimit", "FREE")).toBe(5)
  })

  it("PRO user has unlimited (null) doubt solver", () => {
    expect(getEntitlement("doubtSolverDailyLimit", "PRO")).toBeNull()
  })

  it("FREE user cannot upload notes", () => {
    expect(getEntitlement("canUploadNotes", "FREE")).toBe(false)
  })

  it("PRO user can upload notes", () => {
    expect(getEntitlement("canUploadNotes", "PRO")).toBe(true)
  })

  it("FREE user has no advanced analytics", () => {
    expect(getEntitlement("advancedAnalytics", "FREE")).toBe(false)
  })

  it("INSTITUTION user has institution dashboard", () => {
    expect(getEntitlement("institutionDashboard", "INSTITUTION")).toBe(true)
  })

  it("PRO user has no institution dashboard", () => {
    expect(getEntitlement("institutionDashboard", "PRO")).toBe(false)
  })

  it("undefined plan defaults to FREE limits", () => {
    expect(getEntitlement("doubtSolverDailyLimit", undefined)).toBe(5)
  })
})

describe("isPro", () => {
  it("PRO is pro", () => expect(isPro("PRO")).toBe(true))
  it("INSTITUTION is pro", () => expect(isPro("INSTITUTION")).toBe(true))
  it("FREE is not pro", () => expect(isPro("FREE")).toBe(false))
  it("undefined is not pro", () => expect(isPro(undefined)).toBe(false))
})

describe("isInstitution", () => {
  it("INSTITUTION matches", () => expect(isInstitution("INSTITUTION")).toBe(true))
  it("PRO does not match", () => expect(isInstitution("PRO")).toBe(false))
})

describe("canUseDoubtSolver", () => {
  it("FREE: can use if under limit", () => {
    expect(canUseDoubtSolver("FREE", 4)).toBe(true)
  })

  it("FREE: cannot use at limit", () => {
    expect(canUseDoubtSolver("FREE", 5)).toBe(false)
  })

  it("PRO: always can use (unlimited)", () => {
    expect(canUseDoubtSolver("PRO", 999)).toBe(true)
  })

  it("INSTITUTION: always can use (unlimited)", () => {
    expect(canUseDoubtSolver("INSTITUTION", 9999)).toBe(true)
  })
})
