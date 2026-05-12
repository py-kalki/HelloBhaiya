"use client"

import { Lock, Gem, Backpack, Crown, Palette, Frame, Medal, Tag } from "lucide-react"

const ITEM_ICONS: Record<string, React.ElementType> = {
  Frame:  Frame as unknown as React.ElementType,
  Border: Crown as unknown as React.ElementType,
  Theme:  Palette as unknown as React.ElementType,
  Badge:  Medal as unknown as React.ElementType,
  Title:  Tag as unknown as React.ElementType,
}

const ITEM_COLORS = [
  "#94A3B8",
  "#60A5FA",
  "#D4FF59",
  "#C084FC",
  "#F59E0B",
]

const items = [
  { id: 1, name: "Starter Frame",  type: "Frame",  reqLevel: 1  },
  { id: 2, name: "Neon Glow",      type: "Border", reqLevel: 5  },
  { id: 3, name: "Toxic Theme",    type: "Theme",  reqLevel: 10 },
  { id: 4, name: "Elite Badge",    type: "Badge",  reqLevel: 25 },
  { id: 5, name: "Master Title",   type: "Title",  reqLevel: 50 },
]

export function InventoryWidget({ currentLevel }: { currentLevel: number }) {
  const unlocked = items.filter(i => currentLevel >= i.reqLevel).length

  return (
    <div className="bg-surface border border-white/6 rounded-[24px] p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Backpack size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Backpack</h3>
            <p className="text-xs text-text-secondary">{unlocked}/{items.length} unlocked</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-text-muted bg-surface-2 border border-white/5 px-2 py-1 rounded-full uppercase tracking-wider">
          Lvl {currentLevel}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {items.map((item, idx) => {
          const isUnlocked = currentLevel >= item.reqLevel
          const color = ITEM_COLORS[idx]!
          const Icon = ITEM_ICONS[item.type] ?? Gem

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                isUnlocked
                  ? "bg-surface-2 border-white/8 hover:border-white/16 cursor-pointer"
                  : "bg-surface-2/30 border-white/4 opacity-50 grayscale cursor-not-allowed"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isUnlocked ? `${color}15` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isUnlocked ? `${color}30` : "transparent"}`
                }}
              >
                <Icon size={17} style={{ color: isUnlocked ? color : "#71717A" }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                <p className="text-[10px] text-text-muted">{item.type}</p>
              </div>

              {isUnlocked ? (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  Active
                </span>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-white/5">
                  <Lock size={10} className="text-text-muted" />
                  <span className="text-[9px] font-bold text-text-muted">Lv.{item.reqLevel}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
