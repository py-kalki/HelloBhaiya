"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { MapPin, CheckCircle2, ChevronRight } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const STEPS = [
  {
    title: "The Foundation",
    topics: ["Cell Biology", "Basic Mathematics", "Physical World"],
    status: "Completed",
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Core Concepts",
    topics: ["Genetics & Evolution", "Mechanics", "Chemical Bonding"],
    status: "In Progress",
    color: "from-accent to-green-400"
  },
  {
    title: "Advanced Mastery",
    topics: ["Human Physiology", "Electrodynamics", "Organic Chemistry"],
    status: "Locked",
    color: "from-violet to-purple-500"
  },
  {
    title: "The Final Sprint",
    topics: ["Full Syllabus Mocks", "Spaced Revision", "Weakness Fixing"],
    status: "Locked",
    color: "from-orange-500 to-red-500"
  }
]

export default function RoadmapsSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header Reveal
    gsap.fromTo(".roadmap-header",
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".roadmap-header", start: "top 85%" }
      }
    )

    // Steps Stagger + Stacking Depth
    const steps = gsap.utils.toArray<HTMLElement>(".roadmap-step")
    steps.forEach((step, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: "top 85%",
        }
      })

      tl.fromTo(step,
        { autoAlpha: 0, x: i % 2 === 0 ? -40 : 40 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: "expo.out" }
      )

      const line = step.querySelector(".step-line")
      if (line) {
        tl.fromTo(line,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 0.6, ease: "power2.inOut" },
          "-=0.4"
        )
      }

      // Stacking Depth (Mobile)
      const nextStep = steps[i + 1]
      if (nextStep) {
        gsap.to(step, {
          scale: 0.94,
          autoAlpha: 0.5,
          scrollTrigger: {
            trigger: nextStep,
            start: "top 35%",
            end: "top 15%",
            scrub: true,
          }
        })
      }
    })

    // Parallax background elements
    gsap.to(".roadmap-glow", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      }
    })

  }, { scope: container })

  return (
    <section ref={container} id="roadmaps" className="relative py-32 pb-64 bg-background overflow-visible">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="roadmap-glow absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full" />
        <div className="roadmap-glow absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-violet/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="roadmap-header text-center mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-6">
            <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
              ✦ Your Path to Success
            </span>
          </div>
          <h2 className="font-sans font-bold text-text-primary text-4xl md:text-6xl tracking-tighter mb-6">
            Interactive <span className="text-accent">Chapter Roadmaps.</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium max-w-2xl mx-auto">
            Stop guessing what to study next. Our dynamic roadmaps adapt to your test scores and tell you exactly where to focus.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {STEPS.map((step, i) => (
              <div 
                key={i} 
                className={`roadmap-step sticky top-[var(--mob-top)] md:relative md:top-auto flex flex-col md:flex-row items-center gap-8 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                } md:min-h-[300px]`}
                style={{ "--mob-top": `calc(10vh + ${i * 2}rem)` } as React.CSSProperties}
              >
                {/* Content Side */}
                <div className="w-full md:w-[45%] pl-14 md:pl-0 bg-background md:bg-transparent rounded-2xl p-4 md:p-0">
                  <div className={`p-6 sm:p-8 rounded-[32px] border border-white/5 bg-[#0a0a0a] md:bg-surface/30 md:backdrop-blur-xl hover:border-white/20 transition-all group cursor-default relative overflow-hidden shadow-2xl`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-white relative overflow-hidden`}>
                         <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20`} />
                         <MapPin className="w-6 h-6 relative z-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{step.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          step.status === "Completed" ? "text-accent" : 
                          step.status === "In Progress" ? "text-blue-400" : "text-text-muted"
                        }`}>
                          {step.status}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {step.topics.map((topic, j) => (
                        <li key={j} className="flex items-center gap-3 text-text-secondary text-sm">
                          <CheckCircle2 className={`w-4 h-4 ${
                            step.status === "Completed" ? "text-accent" : "text-white/10"
                          }`} />
                          {topic}
                        </li>
                      ))}
                    </ul>

                    <button className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
                      Explore Nodes <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-[0px] md:left-1/2 md:-translate-x-1/2 top-[24px] md:top-1/2 md:-translate-y-1/2 z-20">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-4 border-surface flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                      step.status === "Completed" ? "bg-accent shadow-[0_0_12px_rgba(212,255,89,0.8)]" : 
                      step.status === "In Progress" ? "bg-blue-400 animate-pulse" : "bg-white/10"
                    }`} />
                  </div>
                </div>

                {/* Vertical Line Connector (animated) */}
                {i < STEPS.length - 1 && (
                  <div className="step-line absolute left-[39px] md:left-1/2 md:-translate-x-1/2 top-[40px] md:top-[calc(50%+20px)] bottom-[-40px] md:bottom-[-150px] w-[2px] bg-gradient-to-b from-white/20 to-transparent z-10 hidden md:block" />
                )}

                {/* Empty Side (for layout) */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
