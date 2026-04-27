"use client"

import type { TestSession } from "@/types/question"

type Props = {
  session: TestSession
  studentName: string
  testDate: string
}

// All styles are hardcoded inline — html2canvas cannot read CSS vars or Tailwind classes
export function PDFTemplate({ session, studentName, testDate }: Props) {
  const correct = Object.keys(session.answers).length - (session.wrong_questions?.length ?? 0)
  const wrong = session.wrong_questions?.length ?? 0
  const unattempted = (session.questions?.length ?? 0) - Object.keys(session.answers).length

  return (
    <div
      id="pdf-template"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#ffffff",
        color: "#111111",
        width: "794px",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* Page 1: Header + Score */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #111111",
            paddingBottom: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>HelloBhaiya</div>
            <div style={{ fontSize: "12px", color: "#666666" }}>Test Report</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#666666" }}>
            <div>{studentName}</div>
            <div>{testDate}</div>
            <div>Mode: {session.mode}</div>
          </div>
        </div>

        {/* Score card */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            background: "#f5f5f5",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "48px", fontWeight: 900, color: "#111111" }}>
              {session.score}
            </div>
            <div style={{ fontSize: "14px", color: "#666666" }}>/ {session.max_score}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "8px" }}>
              {session.accuracy}% accuracy
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "13px" }}>
              ✓ Correct: <strong>{correct}</strong>
            </div>
            <div style={{ fontSize: "13px" }}>
              ✗ Wrong: <strong>{wrong}</strong>
            </div>
            <div style={{ fontSize: "13px" }}>
              — Skipped: <strong>{unattempted}</strong>
            </div>
            <div style={{ fontSize: "13px" }}>
              ⏱ Time: <strong>{Math.round(session.time_taken_seconds / 60)}m</strong>
            </div>
            <div style={{ fontSize: "13px" }}>
              ⚡ XP earned: <strong>+{session.xp_earned}</strong>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        {Object.keys(session.subject_accuracy ?? {}).length > 0 && (
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
              Subject Accuracy
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(session.subject_accuracy ?? {}).map(([subject, acc]) => (
                <div key={subject} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "100px", fontSize: "13px" }}>{subject}</div>
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      background: "#e0e0e0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${acc}%`,
                        height: "100%",
                        background: acc >= 75 ? "#22c55e" : acc >= 50 ? "#f59e0b" : "#ef4444",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <div style={{ width: "36px", fontSize: "13px", fontWeight: 700 }}>{acc}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak areas */}
        {(session.wrong_questions?.length ?? 0) > 0 && (
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
              Wrong Questions ({session.wrong_questions?.length})
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666666",
                lineHeight: "1.8",
                wordBreak: "break-all",
              }}
            >
              {session.wrong_questions?.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
