"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, Flame, Zap, Plus, ChevronRight } from "lucide-react"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

export function TopBar() {
  const { profile } = useUserProfile()
  const pathname = usePathname()

  // Generate breadcrumbs based on pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentSection = pathSegments[0] 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : "Dashboard"

  return (
    <header className="hidden md:flex sticky top-0 z-40 items-center justify-between px-8 h-20 bg-background/60 backdrop-blur-2xl border-b border-white/5">
      {/* Left section: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center group transition-transform hover:scale-105">
          <img src="/hellobhaiya-logo.svg" alt="HelloBhaiya" className="h-8 w-auto object-contain" />
        </Link>
        
        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Platform</span>
          <ChevronRight size={14} className="text-text-muted" />
          <span className="text-white font-medium">{currentSection}</span>
        </div>
      </div>

      {/* Right section: Stats & Profile */}
      <div className="flex items-center gap-5">
        
        {/* Quick Action Button */}
        <Link href="/study-room" className="hidden lg:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mr-2">
          <Plus size={16} className="text-accent" />
          <span>New Session</span>
        </Link>

        {/* Global Stats Bar */}
        <div className="hidden lg:flex items-center bg-surface-2 border border-white/5 rounded-full p-1 shadow-inner">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
            <Flame size={16} className="text-orange-500 fill-orange-500/20" />
            <span className="text-sm font-bold text-white">{profile?.streak_current ?? 0}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
            <Zap size={16} className="text-accent fill-accent/20" />
            <span className="text-sm font-bold text-white">{(profile?.xp_total ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Search */}
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors relative">
          <Bell size={18} />
          <div className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
        </button>

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="ml-2 relative w-10 h-10 rounded-full bg-surface border-2 border-white/10 overflow-hidden hover:border-accent transition-colors group"
        >
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet/40 to-violet/10 flex items-center justify-center text-sm font-bold text-white group-hover:scale-110 transition-transform">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
