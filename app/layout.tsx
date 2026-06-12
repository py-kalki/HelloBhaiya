import type { Metadata } from "next"
import Script from "next/script"
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://hellobhaiya.app"),
  title: {
    default: "HelloBhaiya — Study harder. Level up.",
    template: "%s | HelloBhaiya"
  },
  description:
    "Dark-themed, gamified study platform for NEET & JEE aspirants. Custom tests, XP system, weakness radar, and spaced-repetition revision.",
  keywords: ["NEET", "JEE", "study", "mock test", "gamification", "India", "NEET UG", "JEE Main", "JEE Advanced", "spaced-repetition", "study planner", "exam preparation"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HelloBhaiya",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hellobhaiya.app",
    title: "HelloBhaiya — Level up your study game.",
    description: "Dark-themed, gamified study platform for NEET & JEE aspirants. Custom tests, XP system, weakness radar, and spaced-repetition revision.",
    siteName: "HelloBhaiya",
    images: [
      {
        url: "/hellobhaiya-logo.svg", // Ideally this should be a high-res PNG/JPG for OG, but this is a solid fallback
        width: 1200,
        height: 630,
        alt: "HelloBhaiya Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HelloBhaiya — Study harder. Level up.",
    description: "Dark-themed, gamified study platform for NEET & JEE aspirants.",
    images: ["/hellobhaiya-logo.svg"],
  },
}

export const viewport = {
  themeColor: "#0E0E0F",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(() => {}); }`,
          }}
        />
      </body>
    </html>
  )
}
