"use client"

import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging"
import { app, db as firestoreDb } from "./client"
import { doc, updateDoc } from "firebase/firestore"

let messaging: Messaging | null = null

function getMessagingInstance(): Messaging | null {
  if (typeof window === "undefined") return null
  if (!messaging) {
    try {
      messaging = getMessaging(app)
    } catch {
      return null
    }
  }
  return messaging
}

export async function requestNotificationPermission(uid: string): Promise<boolean> {
  const m = getMessagingInstance()
  if (!m) return false

  const permission = await Notification.requestPermission()
  if (permission !== "granted") return false

  const vapidKey = process.env["NEXT_PUBLIC_FIREBASE_VAPID_KEY"] ?? ""
  const token = await getToken(m, { vapidKey }).catch(() => null)
  if (!token) return false

  await updateDoc(doc(firestoreDb, "users", uid), { fcm_token: token })
  return true
}

export function onForegroundMessage(callback: (payload: object) => void): () => void {
  const m = getMessagingInstance()
  if (!m) return () => {}
  return onMessage(m, callback)
}
