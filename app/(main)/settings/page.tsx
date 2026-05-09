"use client"

import { useState, useTransition } from "react"
import { deleteAccount } from "@/actions/deleteAccount"
import { setLocale } from "@/actions/setLocale"
import { useTranslations } from "next-intl"
import { ArrowLeft, Trash2, AlertTriangle, Languages, Moon, LifeBuoy, Mail, Info } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [localeChanging, startLocaleTransition] = useTransition()
  const [error, setError] = useState("")
  const [currentLocale, setCurrentLocale] = useState<"en" | "hi">(
    () => (document.cookie.includes("locale=hi") ? "hi" : "en")
  )

  function handleLocaleChange(locale: "en" | "hi") {
    setCurrentLocale(locale)
    startLocaleTransition(async () => {
      await setLocale(locale)
    })
  }

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
        <h1 className="text-text-primary font-bold text-lg">{t("title")}</h1>
      </div>

      {/* Language toggle */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-text-secondary" />
          <h2 className="text-text-primary font-semibold text-sm">{t("language")}</h2>
        </div>
        <div className="flex gap-2">
          {(["en", "hi"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              disabled={localeChanging}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] border disabled:opacity-60 ${
                currentLocale === loc
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:border-text-secondary"
              }`}
            >
              {loc === "en" ? "English" : "हिंदी"}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications section */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <h2 className="text-text-primary font-semibold text-sm">{t("notifications")}</h2>
        <p className="text-xs text-text-secondary">{t("notifications_soon")}</p>
      </section>

      {/* Appearance section */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2">
          <Moon size={16} className="text-text-secondary" />
          <h2 className="text-text-primary font-semibold text-sm">{t("appearance")}</h2>
        </div>
        <div className="p-3 rounded-lg bg-background/50 border border-border/50 flex flex-col gap-1.5 cursor-not-allowed opacity-80">
          <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
            {t("theme_dark")}
          </p>
          <p className="text-xs text-text-secondary">
            {t("theme_locked")}
          </p>
        </div>
      </section>

      {/* Support & About */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2">
          <LifeBuoy size={16} className="text-text-secondary" />
          <h2 className="text-text-primary font-semibold text-sm">{t("support")}</h2>
        </div>
        
        <div className="flex flex-col gap-2 mt-1">
          <button className="flex items-center justify-between py-2 text-sm text-text-secondary hover:text-text-primary transition-colors text-left">
            <span className="flex items-center gap-2"><Info size={14} /> {t("help_center")}</span>
          </button>
          <a href="mailto:support@hellobhaiya.com" className="flex items-center justify-between py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <span className="flex items-center gap-2"><Mail size={14} /> {t("contact_us")}</span>
          </a>
          <div className="py-2 text-xs text-text-muted border-t border-border mt-2 pt-3 flex justify-between">
            <span>{t("app_version")}</span>
            <span>&copy; 2026 HelloBhaiya</span>
          </div>
        </div>
      </section>

      {/* Sign out */}
      <section className="flex flex-col gap-3">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full py-3 rounded-xl border border-border text-text-secondary text-sm font-semibold hover:border-text-secondary transition-colors min-h-[44px]"
          >
            {t("sign_out")}
          </button>
        </form>
      </section>

      {/* Delete account */}
      <section className="flex flex-col gap-3 p-4 rounded-xl border border-danger/30 bg-danger/5">
        <div className="flex items-center gap-2 text-danger text-sm font-semibold">
          <AlertTriangle size={16} />
          {t("danger_zone")}
        </div>
        <p className="text-xs text-text-secondary">{t("delete_confirm")}</p>
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-danger/40 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors min-h-[44px]"
          >
            <Trash2 size={14} />
            {t("delete_account")}
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-secondary">
              {t("delete_type").split("DELETE").map((part, i) =>
                i === 0 ? part : <><strong key="d" className="text-text-primary">DELETE</strong>{part}</>
              )}
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
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isPending}
                className="flex-1 bg-danger text-background rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 min-h-[44px]"
              >
                {isPending ? t("deleting") : t("confirm_delete")}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
