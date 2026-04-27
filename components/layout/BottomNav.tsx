"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, BookOpen, Map, User } from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Home",    Icon: Home     },
  { href: "/test/build", label: "Test",    Icon: FileText },
  { href: "/notes",      label: "Notes",   Icon: BookOpen },
  { href: "/roadmap",    label: "Roadmap", Icon: Map      },
  { href: "/profile",    label: "Profile", Icon: User     },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-surface">
      <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-[44px] transition-colors",
                active ? "text-accent" : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
