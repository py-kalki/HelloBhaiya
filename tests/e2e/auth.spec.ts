import { test, expect } from "@playwright/test"

// ──────────────────────────────────────────────────────────────────────────────
// Login page — no Firebase credentials needed (client component, SSR skipped)
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Login page", () => {
  test("renders logo, tagline and Google sign-in button", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "HelloBhaiya" })).toBeVisible()
    await expect(page.getByText("Study harder. Level up.")).toBeVisible()
    await expect(
      page.getByRole("button", { name: /continue with google/i })
    ).toBeEnabled()
  })

  test("Google sign-in button is not disabled by default", async ({ page }) => {
    await page.goto("/login")
    await expect(
      page.getByRole("button", { name: /continue with google/i })
    ).not.toBeDisabled()
  })

  test("error banner is hidden on initial render", async ({ page }) => {
    await page.goto("/login")
    // The error div only mounts when error state is set — should not be in DOM
    await expect(page.locator("text=Sign-in failed")).not.toBeVisible()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Auth guard — requires FIREBASE_ADMIN_SERVICE_ACCOUNT so the (main) layout
// can initialise the Admin SDK. Without it the module throws at import time
// and the server returns a 500 instead of the expected /login redirect.
// Set the secret in CI via GitHub Actions secrets to enable these tests.
// ──────────────────────────────────────────────────────────────────────────────

test.describe("Auth guard — protected routes redirect to /login", () => {
  test.skip(
    !process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT,
    "FIREBASE_ADMIN_SERVICE_ACCOUNT not configured — skipping protected-route tests"
  )

  const protectedRoutes = [
    "/dashboard",
    "/roadmap",
    "/leaderboard",
    "/profile",
    "/revision",
  ]

  for (const route of protectedRoutes) {
    test(`${route} redirects unauthenticated users to /login`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login(\?.*)?$/)
    })
  }
})
