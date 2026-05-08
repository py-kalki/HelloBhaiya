/**
 * Feature entitlement gating for Free / Pro / Institution plans.
 * Reads from the UserProfile.plan field (set by Stripe webhook on purchase).
 */

export type Plan = "FREE" | "PRO" | "INSTITUTION"

export const PLAN_FEATURES = {
  // AI Doubt Solver daily limit (null = unlimited)
  doubtSolverDailyLimit: {
    FREE:        5,
    PRO:         null,
    INSTITUTION: null,
  },
  // Community note uploads
  canUploadNotes: {
    FREE:        false,
    PRO:         true,
    INSTITUTION: true,
  },
  // Advanced analytics
  advancedAnalytics: {
    FREE:        false,
    PRO:         true,
    INSTITUTION: true,
  },
  // PDF report export
  pdfExport: {
    FREE:        true,  // basic PDF — all tiers
    PRO:         true,
    INSTITUTION: true,
  },
  // Institution teacher dashboard
  institutionDashboard: {
    FREE:        false,
    PRO:         false,
    INSTITUTION: true,
  },
} as const

export function getEntitlement<K extends keyof typeof PLAN_FEATURES>(
  feature: K,
  plan: Plan | undefined
): number | boolean | null {
  const effectivePlan: Plan = plan ?? "FREE"
  return PLAN_FEATURES[feature][effectivePlan] as number | boolean | null
}

export function isPro(plan: Plan | undefined): boolean {
  return plan === "PRO" || plan === "INSTITUTION"
}

export function isInstitution(plan: Plan | undefined): boolean {
  return plan === "INSTITUTION"
}

/**
 * Check if a user has exceeded their daily AI Doubt limit.
 * Returns true if they can still make a request.
 */
export function canUseDoubtSolver(plan: Plan | undefined, usageToday: number): boolean {
  const limit = getEntitlement("doubtSolverDailyLimit", plan)
  if (limit === null) return true // unlimited
  return typeof limit === "number" && usageToday < limit
}
