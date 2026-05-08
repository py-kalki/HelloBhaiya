interface Props {
  used: number
  quota: number
}

export function UsageCounter({ used, quota }: Props) {
  const pct = (used / quota) * 100
  const remaining = quota - used

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">Daily Questions Used</span>
        <span className={`text-xs font-medium ${remaining <= 2 ? "text-danger" : "text-text-secondary"}`}>
          {used} / {quota}
        </span>
      </div>
      <div className="w-full bg-surface rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${
            pct >= 80 ? "bg-danger" : pct >= 50 ? "bg-warning" : "bg-success"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining <= 2 && remaining > 0 && (
        <p className="text-xs text-danger">{remaining} question{remaining === 1 ? "" : "s"} remaining today</p>
      )}
    </div>
  )
}
