"use client"

import Link from "next/link"
import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Twitter, Instagram, Youtube, ArrowUpRight, Github } from "lucide-react"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// ── Brand icons (lucide-react v1.11+ removed all social icons) ───────────────
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LINKS = {
  Platform: [
    { label: "Mock Tests",      href: "/login" },
    { label: "Chapter Roadmap", href: "/login" },
    { label: "Weakness Radar",  href: "/login" },
    { label: "XP & Rankings",   href: "/login" },
    { label: "Revision Vault",  href: "/login" },
  ],
  Resources: [
    { label: "NEET Syllabus",  href: "#" },
    { label: "JEE Syllabus",   href: "#" },
    { label: "Study Guides",   href: "#" },
    { label: "Question Bank",  href: "#" },
    { label: "Past Papers",    href: "#" },
    { label: "Blog",           href: "#" },
  ],
  Company: [
    { label: "About Us",       href: "#about"                    },
    { label: "Features",       href: "#features"                 },
    { label: "Roadmaps",       href: "#roadmaps"                 },
    { label: "Contact",        href: "mailto:hello@hellobhaiya.app" },
    { label: "Privacy Policy", href: "#"                         },
  ],
}

const SOCIALS = [
  { icon: <TwitterIcon />,   href: "#", label: "Twitter"   },
  { icon: <InstagramIcon />, href: "#", label: "Instagram" },
  { icon: <YoutubeIcon />,   href: "#", label: "YouTube"   },
  { icon: <GithubIcon />,    href: "#", label: "GitHub"    },
]

export default function FooterSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(".footer-col",
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: container.current, start: "top 90%" }
      }
    )
  }, { scope: container })

  return (
    <footer
      ref={container}
      id="footer"
      className="relative bg-background border-t border-white/5 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

        {/* ── Top Row ────────────────────────────────────────────────────── */}
        <div className="footer-col grid grid-cols-1 lg:grid-cols-5 gap-12 py-16 border-b border-white/5">

          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6 pr-0 lg:pr-12">
            {/* Logo */}
            <Link href="/" className="group flex items-center mb-6">
              <Image 
                src="/hellobhaiya-logo.svg" 
                alt="HelloBhaiya Logo" 
                width={200} 
                height={48} 
                className="h-12 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              The gamified platform for NEET, JEE & beyond. Built by aspirants, for aspirants.
              Study smarter. Level up. Crack it.
            </p>

            {/* CTA mini */}
            <Link
              href="/login"
              className="group w-fit flex items-center gap-2 bg-accent text-black font-bold text-xs uppercase tracking-widest rounded-full px-5 h-9 hover:bg-[#cbf745] transition-colors"
            >
              Get Started Free
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-surface border border-white/5 hover:border-white/20 flex items-center justify-center text-text-secondary hover:text-white transition-all hover:bg-surface/80"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="footer-col flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-muted text-sm hover:text-white transition-colors group flex items-center gap-1"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Row ─────────────────────────────────────────────────── */}
        <div className="footer-col flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} HelloBhaiya. Made with ♥ in India for NEET & JEE aspirants.
          </p>
          <div className="flex items-center gap-1 text-text-muted text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
