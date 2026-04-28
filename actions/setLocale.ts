"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function setLocale(locale: "en" | "hi"): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,             // readable by JS for optimistic UI
    sameSite: "lax",
  })
  revalidatePath("/", "layout")
}
