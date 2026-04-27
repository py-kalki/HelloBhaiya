import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

const FEATURES = [
  {
    icon: "📝",
    title: "Custom Tests",
    description:
      "Build chapter-wise or full-syllabus tests in seconds. Set difficulty, timer, and question count.",
  },
  {
    icon: "🎯",
    title: "Weakness Radar",
    description:
      "Visual radar chart that shows exactly which subjects and chapters need attention.",
  },
  {
    icon: "⚡",
    title: "XP & Levels",
    description:
      "Earn XP for every test, maintain streaks, and climb from Rookie all the way to NEET Legend.",
  },
]

export default async function LandingPage() {
  const session = (await cookies()).get("session")?.value
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <span className="font-bold text-text-primary tracking-tight">HelloBhaiya</span>
        </div>
        <Link
          href="/login"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 gap-8">
        <div className="flex flex-col items-center gap-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-text-secondary text-xs font-medium">
            🇮🇳 Built for NEET &amp; JEE aspirants
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight tracking-tight">
            Study harder.{" "}
            <span className="text-success">Level up.</span>
          </h1>

          <p className="text-text-secondary text-lg leading-relaxed max-w-md">
            The gamified study platform that tracks your weaknesses, builds custom tests,
            and rewards every hour you put in.
          </p>

          <Link
            href="/login"
            className="mt-2 inline-flex items-center justify-center h-12 px-8 rounded-xl bg-accent text-background font-semibold text-sm hover:opacity-90 transition-opacity min-w-[180px]"
          >
            Start for free →
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-5 rounded-xl bg-surface border border-border text-left"
            >
              <span className="text-3xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-text-primary text-sm">{f.title}</p>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border text-center text-text-secondary text-xs">
        © 2026 HelloBhaiya. Made with ❤️ for India&apos;s 2.4M NEET aspirants.
      </footer>
    </div>
  )
}
