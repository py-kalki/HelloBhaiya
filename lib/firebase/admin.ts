import { initializeApp, getApps, cert, type App } from "firebase-admin/app"

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!serviceAccount) {
    throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT env var is not set")
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccount) as object),
  })
}

export const adminApp = getAdminApp()
