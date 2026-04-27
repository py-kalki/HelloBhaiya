"use client"

type Props = {
  score: number
  maxScore: number
  accuracy: number
  subjectAccuracy: Record<string, number>
}

function getScoreColor(accuracy: number): string {
  if (accuracy >= 75) return "text-success"
  if (accuracy >= 50) return "text-warning"
  return "text-danger"
}

const SUBJECT_COLORS: Record<string, string> = {
  Biology: "bg-success",
  Physics: "bg-accent",
  Chemistry: "bg-warning",
  Mathematics: "bg-danger",
}

export function ScoreHero({ score, maxScore, accuracy, subjectAccuracy }: Props) {
  const subjects = Object.entries(subjectAccuracy)

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Score display */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-end gap-2">
          <span className={`text-6xl font-bold font-mono ${getScoreColor(accuracy)}`}>
            {score}
          </span>
          <span className="text-text-secondary text-2xl font-mono mb-2">/ {maxScore}</span>
        </div>
        <span className={`text-lg font-semibold ${getScoreColor(accuracy)}`}>
          {accuracy}% accuracy
        </span>
      </div>

      {/* Subject breakdown bar */}
      {subjects.length > 0 && (
        <div className="w-full max-w-sm flex flex-col gap-2">
          <div className="flex rounded-full overflow-hidden h-3 gap-px">
            {subjects.map(([subject], i) => (
              <div
                key={subject}
                className={`${SUBJECT_COLORS[subject] ?? "bg-border"} flex-1`}
                style={{ opacity: 0.5 + 0.5 / (i + 1) }}
              />
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {subjects.map(([subject, acc]) => (
              <div key={subject} className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${SUBJECT_COLORS[subject] ?? "bg-border"}`}
                />
                <span className="text-text-secondary">{subject}</span>
                <span className={`font-semibold font-mono ${getScoreColor(acc)}`}>{acc}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
