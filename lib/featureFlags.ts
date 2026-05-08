/**
 * PostHog feature flag helpers for A/B testing and gradual rollouts.
 * All flag evaluation is server-side for consistent experience.
 *
 * To add a new flag:
 * 1. Add it to FEATURE_FLAGS below
 * 2. Create the flag in PostHog dashboard with the same key
 * 3. Use isFeatureEnabled() in server components / actions
 */

export const FEATURE_FLAGS = {
  /** Pricing page variant test: 'control' | 'annual_discount' */
  PRICING_VARIANT: "pricing-page-variant",
  /** Show battle mode invite nudge on dashboard */
  BATTLE_NUDGE: "battle-nudge-dashboard",
  /** New onboarding flow (shorter, 3 steps instead of 5) */
  ONBOARDING_V2: "onboarding-v2",
  /** Daily streak protection (Pro feature test) */
  STREAK_SHIELD: "streak-shield-free",
} as const

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS]

/**
 * Server-side flag check via PostHog's Node.js API.
 * Falls back to false if PostHog is not configured.
 */
export async function isFeatureEnabled(
  flagKey: FeatureFlagKey,
  distinctId: string
): Promise<boolean> {
  const apiKey = process.env.POSTHOG_SERVER_API_KEY
  if (!apiKey) return false

  try {
    const res = await fetch(
      `https://us.i.posthog.com/decide?v=3`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          distinct_id: distinctId,
        }),
        next: { revalidate: 60 }, // cache for 60s per user
      }
    )

    if (!res.ok) return false
    const data = await res.json() as { featureFlags?: Record<string, boolean | string> }
    const flagValue = data.featureFlags?.[flagKey]
    return flagValue === true || flagValue === "true"
  } catch {
    return false
  }
}

/**
 * Get feature flag variant for multivariate tests.
 * Returns the variant string or 'control' as default.
 */
export async function getFeatureFlagVariant(
  flagKey: FeatureFlagKey,
  distinctId: string
): Promise<string> {
  const apiKey = process.env.POSTHOG_SERVER_API_KEY
  if (!apiKey) return "control"

  try {
    const res = await fetch(
      `https://us.i.posthog.com/decide?v=3`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          distinct_id: distinctId,
        }),
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return "control"
    const data = await res.json() as { featureFlags?: Record<string, boolean | string> }
    const flagValue = data.featureFlags?.[flagKey]
    return typeof flagValue === "string" ? flagValue : "control"
  } catch {
    return "control"
  }
}
