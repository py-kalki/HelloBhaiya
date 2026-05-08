"use client"

import Link from "next/link"
import { Search, Bell } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

export function TopBar() {
  const { profile } = useUserProfile()

  return (
    <header className="hidden md:flex sticky top-0 z-40 items-center justify-between px-8 h-16 bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </div>
        <span className="font-semibold text-text-primary tracking-tight text-base">HelloBhaiya</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Search Mock */}
        <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer">
           <Search size={16} />
        </div>
        {/* Bell Mock */}
        <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer relative">
           <Bell size={16} />
           <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent border-[1.5px] border-background" />
        </div>

        {/* Profile */}
        <Link
          href="/profile"
          className="ml-2 w-9 h-9 rounded-full bg-surface border border-border overflow-hidden"
        >
          {/* Using a placeholder avatar color matching the vibe */}
          <div className="w-full h-full bg-violet/20 flex items-center justify-center text-sm font-semibold text-violet">
             {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        </Link>
      </div>
    </header>
  )
}
