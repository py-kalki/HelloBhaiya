import { Check, Zap, Users, BookOpen } from "lucide-react"
import Link from "next/link"

const FREE_FEATURES = [
  "Unlimited custom NEET/JEE tests",
  "XP & level progression",
  "Chapter health radar",
  "Spaced repetition revision",
  "Battle Mode (Level 10+)",
  "AI Doubt Solver (5/day)",
  "Leaderboard",
]

const PRO_FEATURES = [
  ...FREE_FEATURES,
  "Unlimited AI Doubt Solver",
  "Advanced analytics & predicted score",
  "Community note uploads",
  "Priority question bank updates",
  "Export performance reports (PDF)",
]

const INSTITUTION_FEATURES = [
  "Everything in Pro (per student)",
  "Teacher dashboard",
  "Class leaderboard & drill-downs",
  "Bulk student enrollment",
  "Custom question bank",
  "CSV data exports",
  "Dedicated support",
]

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto w-full pb-16">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold text-text-primary">Simple pricing</h1>
        <p className="text-sm text-text-secondary">Start free. Upgrade when you need more.</p>
      </div>

      {/* Free */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Free</h2>
          </div>
          <p className="text-3xl font-bold text-text-primary mt-2">₹0</p>
          <p className="text-xs text-text-secondary">Forever free for students</p>
        </div>

        <ul className="space-y-2">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-success mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/login"
          className="block w-full py-3 border border-border rounded-xl text-sm font-bold text-text-primary text-center min-h-[44px]"
        >
          Get Started Free
        </Link>
      </div>

      {/* Pro */}
      <div className="bg-surface border border-accent/40 rounded-2xl p-6 space-y-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-accent text-background text-[10px] font-bold px-2 py-0.5 rounded-full">
          COMING SOON
        </div>

        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Pro</h2>
          </div>
          <p className="text-3xl font-bold text-text-primary mt-2">₹199<span className="text-base font-normal text-text-secondary">/mo</span></p>
          <p className="text-xs text-text-secondary">Everything you need to crack NEET/JEE</p>
        </div>

        <ul className="space-y-2">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-success mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button
          disabled
          className="w-full py-3 bg-accent/30 text-accent/60 font-bold rounded-xl text-sm cursor-not-allowed min-h-[44px]"
        >
          Notify Me When Available
        </button>
      </div>

      {/* Institution */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Institution</h2>
          </div>
          <p className="text-3xl font-bold text-text-primary mt-2">Custom</p>
          <p className="text-xs text-text-secondary">For coaching centres &amp; schools</p>
        </div>

        <ul className="space-y-2">
          {INSTITUTION_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-success mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <a
          href="mailto:hello@hellobhaiya.app?subject=Institution Plan Enquiry"
          className="block w-full py-3 bg-accent text-background font-bold rounded-xl text-sm text-center min-h-[44px]"
        >
          Contact Us
        </a>
      </div>

      <p className="text-center text-xs text-text-secondary">
        All prices in INR. No hidden fees. Cancel anytime.
      </p>
    </div>
  )
}
