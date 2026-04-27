"use client"

type Props = {
  totalSeconds: number
  remainingSeconds: number
  isPaused: boolean
}

const RADIUS = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({ totalSeconds, remainingSeconds, isPaused }: Props) {
  const fraction = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const isWarning = remainingSeconds <= 300 // ≤ 5 min

  const strokeColor = isPaused
    ? "#888888"
    : isWarning
      ? "#E09090"
      : "#90D4A8"

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="relative w-16 h-16">
        <svg
          width={64}
          height={64}
          viewBox="0 0 64 64"
          className={isWarning && !isPaused ? "animate-pulse" : ""}
        >
          {/* Background track */}
          <circle
            cx={32}
            cy={32}
            r={RADIUS}
            fill="none"
            stroke="#272729"
            strokeWidth={4}
          />
          {/* Progress arc */}
          <circle
            cx={32}
            cy={32}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.3s" }}
          />
        </svg>
        {/* Time text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono text-xs font-bold leading-none ${
              isWarning && !isPaused ? "text-danger" : "text-text-primary"
            }`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
      {isPaused && (
        <span className="text-xs text-text-secondary">Paused</span>
      )}
    </div>
  )
}
