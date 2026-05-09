"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FlaskConical, BookOpen, Map, Swords, Video } from "lucide-react"
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Home",   Icon: Home         },
  { href: "/test/build", label: "Test",   Icon: FlaskConical },
  { href: "/study",      label: "Study",  Icon: Video        },
  { href: "/battle",     label: "Battle", Icon: Swords       },
  { href: "/notes",      label: "Notes",  Icon: BookOpen     },
  { href: "/roadmap",    label: "Map",    Icon: Map          },
]

export function BottomNav() {
  const items = NAV_ITEMS.map((nav) => ({
    label: nav.label,
    href: nav.href,
    icon: nav.Icon
  }))

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden h-16 pointer-events-none">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border pointer-events-auto" />

      <div className="relative h-full safe-area-bottom pointer-events-auto">
        <InteractiveMenu items={items} />
      </div>
    </nav>
  )
}
