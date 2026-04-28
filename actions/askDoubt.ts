"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import Anthropic from "@anthropic-ai/sdk"
import { adminApp } from "@/lib/firebase/admin"
import { buildDoubtSolverPrompt } from "@/lib/promptTemplates"
import { toISTDateString } from "@/lib/dateUtils"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

const FREE_QUOTA = 10

export type AskDoubtResult =
  | { ok: true;  solution: string; usedToday: number; quota: number }
  | { ok: false; error: "QUOTA_EXCEEDED" | "API_ERROR"; usedToday: number; quota: number }

export async function askDoubt(
  question: string,
  subject: string,
  imageBase64: string | null
): Promise<AskDoubtResult> {
  const uid = await verifySession()
  const db  = getFirestore(adminApp)

  const today    = toISTDateString()
  const usageRef = db.collection("users").doc(uid).collection("doubt_usage").doc(today)
  const usageDoc = await usageRef.get()
  const usedToday: number = usageDoc.exists ? (usageDoc.data()?.count ?? 0) : 0

  if (usedToday >= FREE_QUOTA) {
    return { ok: false, error: "QUOTA_EXCEEDED", usedToday, quota: FREE_QUOTA }
  }

  const client = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] })

  try {
    const userContent: Anthropic.MessageParam["content"] = imageBase64
      ? [
          {
            type:   "image",
            source: { type: "base64", media_type: "image/jpeg", data: imageBase64 },
          },
          { type: "text", text: question || "Please solve this problem." },
        ]
      : buildDoubtSolverPrompt(question, subject)

    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1024,
      messages:   [{ role: "user", content: userContent }],
    })

    const solution =
      message.content[0]?.type === "text"
        ? message.content[0].text
        : "No response generated."

    await usageRef.set({ count: FieldValue.increment(1), date: today }, { merge: true })

    return { ok: true, solution, usedToday: usedToday + 1, quota: FREE_QUOTA }
  } catch {
    return { ok: false, error: "API_ERROR", usedToday, quota: FREE_QUOTA }
  }
}
