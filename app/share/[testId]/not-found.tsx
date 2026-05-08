import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 text-center gap-4">
      <p className="text-4xl font-bold text-text-primary">404</p>
      <p className="text-text-secondary text-sm">This share link has expired or doesn&apos;t exist.</p>
      <Link
        href="/login"
        className="px-6 py-3 bg-accent text-background font-bold rounded-xl text-sm min-h-[44px]"
      >
        Go to HelloBhaiya
      </Link>
    </div>
  )
}
