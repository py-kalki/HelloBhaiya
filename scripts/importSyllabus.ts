/**
 * Run once to seed Firestore with the NEET syllabus.
 * Usage: npx ts-node --project tsconfig.scripts.json scripts/importSyllabus.ts
 */

import * as admin from "firebase-admin"
import * as path from "path"
import * as fs from "fs"
import type { SyllabusChapter } from "../types/syllabus"

const serviceAccount = JSON.parse(process.env["FIREBASE_ADMIN_SERVICE_ACCOUNT"] ?? "{}")

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

const db = admin.firestore()

async function importSyllabus() {
  const filePath = path.join(__dirname, "data", "neatSyllabus.json")
  const chapters: SyllabusChapter[] = JSON.parse(fs.readFileSync(filePath, "utf-8"))

  console.log(`Importing ${chapters.length} chapters for NEET...`)

  const batchSize = 500
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = db.batch()
    const slice = chapters.slice(i, i + batchSize)
    for (const chapter of slice) {
      const ref = db
        .collection("syllabus")
        .doc("neet")
        .collection("chapters")
        .doc(chapter.chapter_id)
      batch.set(ref, chapter, { merge: true })
    }
    await batch.commit()
    console.log(`  Committed ${i + slice.length}/${chapters.length}`)
  }

  console.log("Syllabus import complete.")
}

importSyllabus().catch((err) => {
  console.error(err)
  process.exit(1)
})
