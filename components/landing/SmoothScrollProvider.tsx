"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Expose lenis globally so any component can call window.__lenis.scrollTo(...)
declare global {
  interface Window {
    __lenis: Lenis | null
  }
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    })

    // Make lenis accessible from anywhere
    window.__lenis = lenis

    // Sync Lenis with GSAP ticker → ScrollTrigger stays accurate
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Keep ScrollTrigger in sync
    lenis.on("scroll", ScrollTrigger.update)

    // Keep framer-motion's useScroll in sync
    lenis.on("scroll", () => window.dispatchEvent(new Event("scroll")))

    return () => {
      window.__lenis = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: call this anywhere to smooth-scroll to a section by id
// ─────────────────────────────────────────────────────────────────────────────
export function scrollToSection(id: string) {
  const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  const lenis = window.__lenis

  if (!id) {
    lenis ? lenis.scrollTo(0, { duration: 1.6, easing }) : window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }

  const el = document.getElementById(id)
  if (!el) return

  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.6, easing })
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}
