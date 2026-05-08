"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Swords, Copy, Check, Hash } from "lucide-react"
import { createBattle } from "@/actions/createBattle"
import { joinBattle } from "@/actions/joinBattle"

export function MatchmakingScreen() {
  const router = useRouter()
  const [creating, startCreate] = useTransition()
  const [joining,  startJoin]   = useTransition()
  const [code,     setCode]     = useState("")
  const [joinErr,  setJoinErr]  = useState("")
  const [copied,   setCopied]   = useState(false)
  const [waitingCode, setWaitingCode] = useState<string | null>(null)
  const [waitingId,   setWaitingId]   = useState<string | null>(null)

  function handleCreate() {
    startCreate(async () => {
      const { battleId, inviteCode } = await createBattle()
      setWaitingCode(inviteCode)
      setWaitingId(battleId)
    })
  }

  function handleJoin() {
    if (!code.trim()) return
    setJoinErr("")
    startJoin(async () => {
      const result = await joinBattle(code)
      if (result.ok) {
        router.push(`/battle?id=${result.battleId}`)
      } else {
        setJoinErr(
          result.error === "NOT_FOUND"      ? "Code not found or battle already started." :
          result.error === "SAME_USER"      ? "You cannot battle yourself." :
          "This battle has already started."
        )
      }
    })
  }

  function copyCode() {
    if (!waitingCode) return
    navigator.clipboard.writeText(waitingCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (waitingCode && waitingId) {
    return (
      <div className="flex flex-col items-center gap-6 pt-12 px-4 max-w-sm mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
          <Swords size={28} className="text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Waiting for opponent…</h2>
          <p className="text-sm text-text-secondary mt-1">Share this code with a friend</p>
        </div>
        <div className="w-full bg-surface-2 border border-border rounded-2xl p-4">
          <p className="text-3xl font-bold text-accent tracking-[0.3em] font-mono">{waitingCode}</p>
          <button
            onClick={copyCode}
            className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mx-auto min-h-[44px] px-4"
          >
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <button
          onClick={() => router.push(`/battle?id=${waitingId}`)}
          className="w-full py-3 bg-accent text-background font-bold rounded-xl text-sm min-h-[44px]"
        >
          Open Battle Room
        </button>
        <button
          onClick={() => { setWaitingCode(null); setWaitingId(null) }}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-10 px-4 max-w-sm mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center">
        <Swords size={28} className="text-danger" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-text-primary">Battle Mode</h1>
        <p className="text-sm text-text-secondary mt-1">
          10 questions · same timer · fastest wins
        </p>
      </div>

      <button
        onClick={handleCreate}
        disabled={creating}
        className="w-full flex items-center justify-center gap-2 py-4 bg-danger text-background font-bold rounded-2xl text-base disabled:opacity-50 min-h-[44px]"
      >
        <Swords size={18} />
        {creating ? "Creating…" : "Start a Battle"}
      </button>

      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-secondary">or join with code</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="w-full space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-3">
            <Hash size={14} className="text-text-secondary shrink-0" />
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setJoinErr("") }}
              placeholder="ENTER CODE"
              maxLength={6}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none py-3 font-mono tracking-widest"
            />
          </div>
          <button
            onClick={handleJoin}
            disabled={joining || !code.trim()}
            className="px-5 py-3 bg-accent text-background text-sm font-bold rounded-xl disabled:opacity-40 min-h-[44px]"
          >
            {joining ? "…" : "Join"}
          </button>
        </div>
        {joinErr && (
          <p className="text-xs text-danger text-center">{joinErr}</p>
        )}
      </div>

      <p className="text-xs text-text-secondary">Requires Level 10 (Molecule) to unlock</p>
    </div>
  )
}
