import Link from "next/link"
import { BookOpen } from "lucide-react"

interface Props {
  solution: string
  subject: string
}

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n")

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="text-sm font-bold text-text-primary mt-3">
              {line.slice(4)}
            </h4>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-base font-bold text-text-primary mt-4">
              {line.slice(3)}
            </h3>
          )
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="text-sm font-semibold text-text-primary">
              {line.slice(2, -2)}
            </p>
          )
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 text-sm text-text-primary">
              <span className="text-text-secondary mt-0.5 shrink-0">•</span>
              <span>{line.slice(2)}</span>
            </div>
          )
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\.\s/)?.[1]
          return (
            <div key={i} className="flex gap-2 text-sm text-text-primary">
              <span className="text-text-secondary shrink-0 font-medium">{num}.</span>
              <span>{line.replace(/^\d+\.\s/, "")}</span>
            </div>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-sm text-text-primary leading-relaxed">
            {line}
          </p>
        )
      })}
    </div>
  )
}

export function SolutionDisplay({ solution, subject }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-surface-2 border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs font-semibold text-text-primary">AI Solution</span>
        </div>
        <MarkdownBlock text={solution} />
      </div>

      {subject && (
        <Link
          href={`/notes?subject=${subject}`}
          className="flex items-center gap-2 px-4 py-3 bg-surface-2 border border-border rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
        >
          <BookOpen size={14} />
          View {subject} notes for more context
        </Link>
      )}
    </div>
  )
}
