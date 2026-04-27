"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FlaskConical, BookOpen, Map, User } from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Home",    Icon: Home         },
  { href: "/test/build", label: "Test",    Icon: FlaskConical },
  { href: "/notes",      label: "Notes",   Icon: BookOpen     },
  { href: "/roadmap",    label: "Roadmap", Icon: Map          },
  { href: "/profile",    label: "Profile", Icon: User         },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border" />

      <div className="relative flex items-center justify-around h-16 px-2 safe-area-bottom">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-[44px] transition-all duration-200"
            >
              <div className={`
                flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200
                ${active
                  ? "bg-accent/12 text-accent"
                  : "text-text-muted hover:text-text-secondary"
                }
              `}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.75}
                  className="transition-all duration-200"
                />
                <span className={`text-[10px] font-medium tracking-wide transition-all duration-200 ${active ? "opacity-100" : "opacity-70"}`}>
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
