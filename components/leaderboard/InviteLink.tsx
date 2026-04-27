"use client"

import { useState } from "react"
import { Copy, Check, Share2 } from "lucide-react"

interface Props {
  inviteCode: string
}

export function InviteLink({ inviteCode }: Props) {
  const [copied, setCopied] = useState(false)
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://hellobhaiya.app"
  const link   = `${appUrl}/join/${inviteCode}`

  async function copy() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: "Join me on HelloBhaiya!", url: link })
    } else {
      copy()
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-secondary">
        Invite friends to compete on the Friends leaderboard
      </p>
      <div className="flex gap-2">
        <div className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-xs text-text-secondary truncate">
          {link}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-surface-2 border border-border rounded-xl text-xs text-text-primary hover:bg-surface transition-colors min-h-[44px]"
        >
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={share}
          className="p-2.5 bg-accent text-background rounded-xl hover:opacity-90 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  )
}
