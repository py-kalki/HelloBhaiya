import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders brand name and hero headline", async ({ page }) => {
    // Brand visible in the floating glass header
    await expect(page.locator("header").getByText("HelloBhaiya")).toBeVisible()
    // Hero h1 spans three lines — check the last word which is unique
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Blindly")
  })

  test("Sign In link navigates to /login", async ({ page }) => {
    // There are two Sign In links (header + CTA); click the first
    await page.getByRole("link", { name: /sign in/i }).first().click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test("shows stats section with aspirant count", async ({ page }) => {
    await expect(page.getByText("2.4M+")).toBeVisible()
    await expect(page.getByText("Aspirants")).toBeVisible()
    await expect(page.getByText("50K+")).toBeVisible()
    await expect(page.getByText("180+")).toBeVisible()
  })

  test("shows all four bento feature cards", async ({ page }) => {
    const features = [
      "Custom Test Engine",
      "Weakness Radar",
      "XP & Streaks",
      "SM-2 Revision",
    ]
    for (const title of features) {
      await expect(page.getByText(title)).toBeVisible()
    }
  })

  test("CTA Begin Free Access button links to /login", async ({ page }) => {
    const cta = page.getByRole("link", { name: /begin free access/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute("href", "/login")
  })

  test("ticker strip is present", async ({ page }) => {
    await expect(page.getByText("NEET 2026").first()).toBeVisible()
  })
})
