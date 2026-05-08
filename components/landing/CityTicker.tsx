"use client"

import { useRef } from "react"
import { useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const CITIES = [
  "Mumbai", "Delhi", "Kota", "Indore", "Jaipur",
  "Chennai", "Hyderabad", "Pune", "Bengaluru", "Nagpur",
]
const TRACK = [...CITIES, ...CITIES]

export default function CityTicker() {
  const [paused, setPaused] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Section headline entrance
    gsap.fromTo(".ticker-headline",
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: ".ticker-headline", start: "top 85%" }
      }
    )

    gsap.fromTo(".ticker-badge",
      { autoAlpha: 0, scale: 0.8 },
      {
        autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".ticker-badge", start: "top 90%" }
      }
    )

    // Fade-in the ticker strip itself
    gsap.fromTo(".ticker-strip",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ".ticker-strip", start: "top 90%" }
      }
    )
  }, { scope: container })

  return (
    <section ref={container} className="py-32 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="text-center max-w-7xl mx-auto px-8 mb-16">
        <div className="ticker-badge inline-block px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-6">
          <span className="text-text-secondary text-[9px] font-bold tracking-[0.2em] uppercase">
            Join students across India
          </span>
        </div>
        <h3 className="ticker-headline text-text-primary text-3xl font-bold tracking-tight">
          From major hubs to your doorstep.
        </h3>
      </div>

      <div
        className="ticker-strip relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute left-0 inset-y-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 inset-y-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex items-center whitespace-nowrap will-change-transform"
          style={{
            animation: "marquee 40s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {TRACK.map((city, i) => (
            <span key={i} className="inline-flex items-center gap-12 font-mono px-6">
              <span className="text-lg font-bold text-text-muted tracking-widest uppercase hover:text-accent transition-colors cursor-default">
                {city}
              </span>
              <span className="text-border text-2xl font-black">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
