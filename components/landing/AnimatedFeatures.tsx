"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  FileText,
  BrainCircuit,
  Lightbulb,
  BookMarked,
  Flame,
  Sparkles,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const FEATURES = [
  {
    icon:  <FileText className="w-8 h-8" />,
    title: "Custom Paper Builder",
    desc:  "Build topic-wise mock tests in seconds. Pick your subjects, chapters, difficulty, and time limit. Instantly generated from thousands of curated, exam-pattern questions — no fluff, just targeted practice.",
    color: "from-[#d4ff59] to-[#80b918]",
    badge: null,
  },
  {
    icon:  <BrainCircuit className="w-8 h-8" />,
    title: "AI Performance Analysis",
    desc:  "After every test, our AI breaks down exactly where you lost marks — by topic, question type, and time spent. No generic feedback. Hyper-specific insights you can act on the same day.",
    color: "from-violet to-purple-600",
    badge: null,
  },
  {
    icon:  <Lightbulb className="w-8 h-8" />,
    title: "AI Answer Suggestions",
    desc:  "Stuck on a question? Our AI walks you through the concept behind the answer, not just the answer itself. Understand the 'why' so the next similar question is never a problem again.",
    color: "from-blue-400 to-blue-600",
    badge: null,
  },
  {
    icon:  <BookMarked className="w-8 h-8" />,
    title: "Open-Source Handwritten Notes",
    desc:  "A curated library of handwritten notes sourced openly from the internet — with full credits to every original creator. No paywalls, no gatekeeping. Just the best notes, in one place, free forever.",
    color: "from-orange-400 to-orange-600",
    badge: null,
  },
  {
    icon:  <Flame className="w-8 h-8" />,
    title: "Gamified Daily Tracker",
    desc:  "Turn your prep into a game. Daily checklists, chapter goals, XP rewards, streak counters, and leaderboard rankings — every study session earns you something. Consistency has never felt this good.",
    color: "from-pink-400 to-rose-600",
    badge: null,
  },
  {
    icon:  <Sparkles className="w-8 h-8" />,
    title: "Much More Coming Soon",
    desc:  "Battle mode (1v1 live tests), Doubt forum, Timetable planner, Rank predictor, Previous year papers with AI walkthrough, Mentor connect, and a lot more being built in public.",
    color: "from-cyan-400 to-sky-600",
    badge: "🚀 In the Roadmap",
  },
]

export default function AnimatedFeatures() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {

    // ── Sticky left column: words fade+rise as section enters ─────────────
    gsap.fromTo(".feature-title-word",
      { autoAlpha: 0, y: 60, rotationX: 60, transformOrigin: "50% 100%" },
      {
        autoAlpha: 1, y: 0, rotationX: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          end:   "top 30%",
          scrub: 1.2,
        }
      }
    )

    // ── Right column cards: Reveal + Stacking Depth ───────────────────────
    const cards = gsap.utils.toArray<HTMLElement>(".feature-card")
    cards.forEach((card, i) => {
      // 1. Entrance animation (Flip reveal)
      gsap.fromTo(card,
        {
          autoAlpha: 0,
          y: 100,
          scale: 0.9,
          rotationX: 25,
          transformOrigin: "50% 0%",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end:   "top 60%",
            scrub: 1.5,
          }
        }
      )

      // 2. Stacking Depth: Scale down this card as the NEXT card comes on top
      const nextCard = cards[i + 1]
      if (nextCard) {
        gsap.to(card, {
          scale: 0.92,
          autoAlpha: 0.5,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 35%",
            end: "top 15%",
            scrub: true,
          }
        })
      }

      // Icon subtle bounce on card entrance
      const icon = card.querySelector(".feat-icon")
      if (icon) {
        gsap.fromTo(icon,
          { scale: 0.5, autoAlpha: 0, rotation: -15 },
          {
            scale: 1, autoAlpha: 1, rotation: 0,
            duration: 0.8,
            ease: "back.out(2.5)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        )
      }
    })

    // ── Parallax glows ────────────────────────────────────────────────────
    gsap.to(".features-glow", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    })

    // ── Left sticky badge subtle float ───────────────────────────────────
    gsap.to(".feat-badge", {
      y: -8,
      repeat: -1,
      yoyo: true,
      duration: 2.8,
      ease: "sine.inOut",
    })

  }, { scope: container })

  return (
    <section
      ref={container}
      id="features"
      className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-64 sm:pb-80 overflow-visible"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="features-glow absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full" />
        <div className="features-glow absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-violet/10 blur-[150px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">

        {/* Sticky Left Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-40 h-fit">
          <div className="feat-badge inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-8">
            <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
              ✦ Core Arsenal
            </span>
          </div>
          <h2 className="font-sans font-bold text-text-primary text-5xl md:text-6xl tracking-tighter leading-[1.1] mb-6 flex flex-wrap gap-x-3 [perspective:600px]">
            <span className="feature-title-word inline-block">Everything</span>
            <span className="feature-title-word inline-block">you</span>
            <span className="feature-title-word inline-block">need.</span>
            <span className="feature-title-word inline-block text-text-secondary w-full mt-2">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md feature-title-word">
            We stripped away the fluff to build the most efficient, gamified, and data-driven
            preparation engine ever built for NEET, JEE & competitive exam aspirants.
          </p>
        </div>

        {/* Scrolling Right Column */}
        <div className="lg:col-span-7 flex flex-col gap-8 sm:gap-12 pt-10 lg:pt-0">
          {FEATURES.map((f, i) => (
            <div 
              key={i} 
              className="sticky block"
              style={{ top: `calc(10vh + ${i * 2.5}rem)` }}
            >
              <div
                className={`feature-card group relative p-8 sm:p-10 rounded-[32px] border transition-colors [transform-style:preserve-3d] shadow-2xl will-change-transform ${
                  f.badge
                    ? "bg-surface border-dashed border-white/10 hover:border-white/20"
                    : "bg-surface border-white/10 hover:border-white/20"
                }`}
              >
                {/* Card hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] rounded-[32px] transition-opacity duration-700`} />

                {/* "Coming Soon" badge */}
                {f.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                    {f.badge}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start relative z-10">
                  <div className={`feat-icon shrink-0 w-16 h-16 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-white relative overflow-hidden group-hover:scale-110 transition-transform duration-500 ease-out shadow-2xl`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-20`} />
                    {f.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-sans font-bold text-text-primary text-2xl mb-4 tracking-tight group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
