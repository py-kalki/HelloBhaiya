"use client"

import { useState, useTransition } from "react"
import { deleteAccount } from "@/actions/deleteAccount"
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleDelete() {
    if (confirmText !== "DELETE") return
    setError("")
    startTransition(async () => {
      try {
        await deleteAccount()
      } catch {
        setError("Failed to delete account. Please try again.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-5 p-4 max-w-2xl mx-auto w-full pb-10">
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-lg"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-text-primary font-bold text-lg">Settings</h1>
      </div>

      {/* Notifications section — stub for Phase 2 */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-primary font-semibold text-sm">Notifications</h2>
        <p className="text-xs text-text-secondary">
          Notification preferences will be available in a future update.
        </p>
      </section>

      {/* Sign out */}
      <section className="flex flex-col gap-3">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full py-3 rounded-xl border border-border text-text-secondary text-sm font-semibold hover:border-text-secondary transition-colors min-h-[44px]"
          >
            Sign Out
          </button>
        </form>
      </section>

      {/* Delete account */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-danger/30 bg-danger/5">
        <div className="flex items-center gap-2 text-danger text-sm font-semibold">
          <AlertTriangle size={16} />
          Danger Zone
        </div>
        <p className="text-xs text-text-secondary">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-danger/40 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors min-h-[44px]"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-secondary">
              Type <strong className="text-text-primary">DELETE</strong> to confirm
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-danger"
            />
            {error && <p className="text-xs text-danger">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setConfirmText("") }}
                className="flex-1 border border-border rounded-xl py-3 text-sm text-text-secondary hover:border-text-secondary transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isPending}
                className="flex-1 bg-danger text-background rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 min-h-[44px]"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
