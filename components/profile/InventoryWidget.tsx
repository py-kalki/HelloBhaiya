"use client"

import { Lock, Unlock, Gem, Backpack } from "lucide-react"

export function InventoryWidget({ currentLevel }: { currentLevel: number }) {
  const items = [
    { id: 1, name: "Starter Avatar Frame", type: "Frame", reqLevel: 1, color: "bg-surface-2", unlocked: true },
    { id: 2, name: "Neon Glow Border", type: "Border", reqLevel: 5, color: "bg-blue-500/20", unlocked: currentLevel >= 5 },
    { id: 3, name: "Toxic Theme", type: "Theme", reqLevel: 10, color: "bg-accent/20", unlocked: currentLevel >= 10 },
    { id: 4, name: "Elite Badge", type: "Badge", reqLevel: 25, color: "bg-purple-500/20", unlocked: currentLevel >= 25 },
    { id: 5, name: "Master Title", type: "Title", reqLevel: 50, color: "bg-orange-500/20", unlocked: currentLevel >= 50 },
  ]

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Backpack size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Backpack</h3>
            <p className="text-xs text-text-secondary">Cosmetics & Unlockables</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              item.unlocked 
                ? "bg-surface-2 border-white/10 hover:border-white/30 cursor-pointer" 
                : "bg-background/50 border-white/5 opacity-60 grayscale cursor-not-allowed"
            }`}
          >
            {/* Mock Item Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <Gem size={20} className={item.unlocked ? "text-white" : "text-text-muted"} />
            </div>
            
            <span className="text-xs font-semibold text-white text-center leading-tight mb-1">{item.name}</span>
            <span className="text-[10px] text-text-muted">{item.type}</span>

            {!item.unlocked && (
              <div className="absolute top-2 right-2 bg-black/60 rounded-md px-1.5 py-0.5 flex items-center gap-1 backdrop-blur-sm">
                <Lock size={10} className="text-red-400" />
                <span className="text-[9px] font-bold text-white">Lvl {item.reqLevel}</span>
              </div>
            )}
            {item.unlocked && (
              <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                <Unlock size={12} className="text-accent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
