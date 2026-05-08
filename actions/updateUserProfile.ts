"use server"

import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminApp } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"

async function verifySession(): Promise<string> {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) throw new Error("Unauthenticated")
  const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  return decoded.uid
}

type UpdateProfileInput = {
  name?: string
  photo_url?: string
}

export async function updateUserProfile(input: UpdateProfileInput) {
  const uid = await verifySession()
  const db = getFirestore(adminApp)
  const auth = getAuth(adminApp)

  // Filter undefined values
  const updates: Record<string, any> = {}
  if (input.name !== undefined) updates.name = input.name
  if (input.photo_url !== undefined) updates.photo_url = input.photo_url

  if (Object.keys(updates).length > 0) {
    // Update Firestore
    await db.collection("users").doc(uid).update(updates)

    // Update Firebase Auth profile if applicable
    const authUpdates: Record<string, string> = {}
    if (input.name !== undefined) authUpdates.displayName = input.name
    if (input.photo_url !== undefined && !input.photo_url.startsWith("data:")) {
      authUpdates.photoURL = input.photo_url
    }
    
    if (Object.keys(authUpdates).length > 0) {
      try {
        await auth.updateUser(uid, authUpdates)
      } catch (err) {
        console.error("Firebase Auth update failed (non-critical):", err)
      }
    }
  }

  revalidatePath("/profile")
  return { success: true }
}
