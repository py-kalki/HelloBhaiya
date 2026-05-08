"use client"

import { Search, Bell, Settings, LayoutDashboard, Target, Activity, FileText, Zap, ChevronRight, User, Trophy, Clock } from "lucide-react"
import Image from "next/image"

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-4 pt-8 px-4 sm:px-8">
      {/* Intense Top Glow for the dashboard edge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-[200px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

      {/* The Dashboard Container */}
      <div className="relative z-10 w-full bg-surface/80 backdrop-blur-3xl border border-white/10 rounded-t-[32px] overflow-hidden shadow-[0_-20px_80px_-20px_rgba(212,255,89,0.15)]">
        {/* Top Edge Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent blur-[2px]" />

        {/* Dashboard Content */}
        <div className="p-6 sm:p-8 pb-0 h-[400px]"> {/* Truncated height to look like it's cut off */}
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Image 
                src="/hellobhaiya-logo.svg" 
                alt="HelloBhaiya Logo" 
                width={160} 
                height={40} 
                className="h-8 w-auto"
                style={{ width: "auto" }}
              />
            </div>

            <div className="hidden sm:flex items-center bg-background border border-white/10 rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-text-muted mr-2" />
              <span className="text-xs text-text-muted">Search chapters...</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-secondary">
                <Bell className="w-4 h-4" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary font-medium hidden sm:block">Hi, Aspirant!</span>
                <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                  A
                </div>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">My Dashboard</h3>
              <div className="flex items-center gap-3">
                {["All", "Mock Tests", "Revision", "Analytics"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      i === 0 
                        ? "bg-accent text-black shadow-[0_0_20px_rgba(212,255,89,0.4)]" 
                        : "bg-background text-text-secondary border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Card */}
            <div className="mock-card lg:col-span-2 bg-background/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-bold text-text-primary">Score Progress</h4>
                <span className="text-xs text-accent hover:text-white transition-colors cursor-pointer">View all →</span>
              </div>
              
              {/* Fake Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-2">
                {[40, 60, 45, 80, 50, 95, 65, 70].map((height, i) => (
                  <div key={i} className="relative flex flex-col items-center flex-1 group">
                    {/* Active Bar Highlight */}
                    {i === 5 && (
                      <div className="mock-bar-label absolute -top-10 flex flex-col items-center animate-bounce">
                        <div className="bg-surface border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 shadow-lg">
                          720/720!
                        </div>
                        <div className="w-4 h-4 rounded-full border-4 border-background bg-accent shadow-[0_0_15px_rgba(212,255,89,0.8)] z-10" />
                      </div>
                    )}
                    <div 
                      className={`mock-bar w-full rounded-t-lg transition-all duration-500 ${
                        i === 5 
                          ? "bg-gradient-to-t from-accent/20 to-accent border-x border-t border-accent/50 shadow-[0_0_30px_rgba(212,255,89,0.3)]" 
                          : "bg-surface group-hover:bg-surface/80"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-text-muted mt-3">Test {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stack */}
            <div className="flex flex-col gap-6">
              {/* Top Stats */}
              <div className="mock-card bg-gradient-to-br from-accent/5 to-background border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,255,89,0.1),transparent_50%)]" />
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <h4 className="text-sm font-bold text-text-primary">Total XP</h4>
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div className="relative z-10 flex items-end justify-between">
                  <span className="text-4xl font-bold text-white tracking-tight">45,600</span>
                  <div className="flex items-center gap-1 text-black text-xs font-bold bg-accent px-2 py-1 rounded-full">
                    <span>↑ 12%</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mock-card bg-background/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex-1 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold text-text-primary">Recent Tests</h4>
                  <span className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">View all →</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Physics Grand Mock", time: "2h ago", score: "165/180", color: "bg-accent", icon: Trophy },
                    { title: "Chem Part Test 3", time: "Yesterday", score: "150/180", color: "bg-surface", icon: Clock }
                  ].map((item, i) => (
                    <div key={i} className="mock-activity-item flex items-center gap-4 group cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-colors`}>
                        <item.icon className={`w-4 h-4 text-text-secondary`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-text-primary">{item.title}</h5>
                        <span className="text-xs text-text-muted">{item.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{item.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Bottom Fade out effect since we are truncating the dashboard */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
