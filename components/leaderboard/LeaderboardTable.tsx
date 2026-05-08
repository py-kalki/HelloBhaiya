import { Flame, Trophy } from "lucide-react"

export type LeaderboardEntry = {
  uid: string
  name: string
  photo_url: string
  level: number
  level_title: string
  xp_this_week: number
  streak_current: number
  city: string
  rank: number
  isCurrentUser: boolean
}

interface Props {
  entries: LeaderboardEntry[]
  currentUserEntry: LeaderboardEntry | null
}

const RANK_COLORS = ["text-warning", "text-text-secondary", "text-warning/60"]
const RANK_BG     = ["bg-warning/10", "bg-border/20", "bg-warning/5"]
const MEDALS      = ["🥇", "🥈", "🥉"]

export function LeaderboardTable({ entries, currentUserEntry }: Props) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary text-sm">No data yet this week</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.uid}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
            entry.isCurrentUser
              ? "bg-accent/5 border-accent/30"
              : "bg-surface-2 border-border"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              entry.rank <= 3 ? RANK_BG[entry.rank - 1] ?? "" : "bg-surface"
            } ${entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] ?? "text-text-primary" : "text-text-secondary"}`}
          >
            {entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}
          </div>

          <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs text-text-secondary shrink-0 overflow-hidden">
            {entry.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={entry.photo_url} alt={entry.name} className="w-full h-full object-cover" />
            ) : (
              entry.name[0]?.toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className={`text-sm font-medium truncate ${entry.isCurrentUser ? "text-accent" : "text-text-primary"}`}>
                {entry.name}
                {entry.isCurrentUser && <span className="text-xs text-text-secondary ml-1">(you)</span>}
              </p>
            </div>
            <p className="text-xs text-text-secondary">{entry.level_title} · Lv.{entry.level}</p>
          </div>

          <div className="text-right shrink-0 space-y-0.5">
            <div className="flex items-center gap-1 justify-end">
              <Trophy size={11} className="text-warning" />
              <span className="text-xs font-bold text-text-primary">
                {entry.xp_this_week.toLocaleString()}
              </span>
            </div>
            {entry.streak_current > 0 && (
              <div className="flex items-center gap-0.5 justify-end">
                <Flame size={10} className="text-warning" />
                <span className="text-xs text-text-secondary">{entry.streak_current}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {currentUserEntry && !entries.find((e) => e.isCurrentUser) && (
        <>
          <div className="text-center py-1">
            <span className="text-xs text-text-secondary">•••</span>
          </div>
          <LeaderboardTable
            entries={[currentUserEntry]}
            currentUserEntry={null}
          />
        </>
      )}
    </div>
  )
}
