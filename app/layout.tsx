import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HelloBhaiya — Study harder. Level up.",
  description:
    "Dark-themed, gamified study platform for NEET & JEE aspirants. Custom tests, XP system, weakness radar, and spaced-repetition revision.",
  keywords: ["NEET", "JEE", "study", "mock test", "gamification", "India"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HelloBhaiya",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport = {
  themeColor: "#0E0E0F",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(() => {}); }`,
          }}
        />
      </body>
    </html>
  )
}
