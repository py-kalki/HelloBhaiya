import { test, expect } from "@playwright/test"

// Phase 2 routes — all require a valid session cookie.
// Without FIREBASE_ADMIN_SERVICE_ACCOUNT the admin SDK can't verify a cookie,
// so these tests are skipped unless the secret is available in the environment.
// In production CI, they run against the Firebase emulator.

test.describe("Phase 2 route — auth guard", () => {
  test.skip(
    !process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT,
    "FIREBASE_ADMIN_SERVICE_ACCOUNT not configured — skipping protected-route tests"
  )

  const phase2Routes = [
    "/doubt",
    "/notes",
    "/roadmap",
    "/timetable",
    "/leaderboard",
  ]

  for (const route of phase2Routes) {
    test(`${route} redirects unauthenticated user to /login`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login(\?.*)?$/)
    })
  }
})

// ──────────────────────────────────────────────────────────────────────────────
// Public surface tests — no auth needed
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Login page content", () => {
  test("has Google sign-in CTA", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeEnabled()
  })
})

test.describe("Landing page — Phase 2 feature references", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("shows Notes feature in feature section", async ({ page }) => {
    const body = await page.textContent("body")
    expect(body).toMatch(/note|revision|roadmap/i)
  })

  test("footer or nav includes product links", async ({ page }) => {
    const links = page.getByRole("link")
    await expect(links.first()).toBeVisible()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Loading skeleton — verify loading.tsx exports are picked up by Next.js
// These load fast enough that we just check the final page renders without
// crashing, not that the skeleton itself is visible (too brief).
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Route health — no-auth pages", () => {
  test("/ returns 200", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
  })

  test("/login returns 200", async ({ page }) => {
    const response = await page.goto("/login")
    expect(response?.status()).toBe(200)
  })
})
