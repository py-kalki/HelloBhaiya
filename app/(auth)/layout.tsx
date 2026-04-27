export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-600/6 blur-[100px]" />
      </div>
      <div className="absolute inset-0 dot-grid opacity-50" aria-hidden />
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
