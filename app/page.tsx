import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import StatsCounter from "@/components/landing/StatsCounter"
import CityTicker from "@/components/landing/CityTicker"
import AnimatedFeatures from "@/components/landing/AnimatedFeatures"
import ProblemSolution from "@/components/landing/ProblemSolution"
import HeroSection from "@/components/landing/HeroSection"
import RoadmapsSection from "@/components/landing/RoadmapsSection"
import CTASection from "@/components/landing/CTASection"
import FooterSection from "@/components/landing/FooterSection"
import AboutSection from "@/components/landing/AboutSection"
import SmoothScrollProvider from "@/components/landing/SmoothScrollProvider"

export default async function LandingPage() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (sessionCookie) redirect("/dashboard")

  return (
    <SmoothScrollProvider>
      <div className="font-sans min-h-dvh bg-background text-text-primary selection:bg-accent selection:text-black overflow-x-hidden">

        {/* ══ NAV + HERO (client component with GSAP) ═══════════════════════ */}
        <HeroSection />

        {/* ══ STATS STRIP ══════════════════════════════════════════════════ */}
        <section className="border-y border-white/5 bg-[#0a0a0a] relative z-20">
          <div className="max-w-[1400px] mx-auto">
            <StatsCounter />
          </div>
        </section>

        {/* ══ FEATURES ═════════════════════════════════════════════════════ */}
        <AnimatedFeatures />

        {/* ══ ROADMAPS ═════════════════════════════════════════════════════ */}
        <RoadmapsSection />

        {/* ══ PROBLEM & SOLUTION ═══════════════════════════════════════════ */}
        <ProblemSolution />

        {/* ══ CITY TICKER ══════════════════════════════════════════════════ */}
        <CityTicker />

        {/* ══ ABOUT US ══════════════════════════════════════════════════════ */}
        <AboutSection />

        {/* ══ FINAL CTA ════════════════════════════════════════════════════ */}
        <CTASection />

        {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
        <FooterSection />

      </div>
    </SmoothScrollProvider>
  )
}
