/**
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/importQuestions.ts ./questions.json
 *   npx ts-node -r tsconfig-paths/register scripts/importQuestions.ts ./questions.csv
 *
 * Env required: FIREBASE_ADMIN_SERVICE_ACCOUNT (JSON stringified service account)
 *
 * JSON format: array of Question objects matching scripts/questionSchema.json
 * CSV format:  header row matching Question fields, comma-separated
 */

import { readFileSync } from "fs"
import { resolve } from "path"
import Ajv from "ajv"
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore, WriteBatch } from "firebase-admin/firestore"

// Load schema
const schema = JSON.parse(
  readFileSync(resolve(__dirname, "questionSchema.json"), "utf-8"),
)

const BATCH_SIZE = 500

type RawQuestion = Record<string, unknown>

function parseCsv(content: string): RawQuestion[] {
  const lines = content.split("\n").filter((l) => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0]!.split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const obj: RawQuestion = {}
    headers.forEach((h, i) => {
      const v = vals[i] ?? ""
      // Coerce booleans and numbers
      if (v === "true") obj[h] = true
      else if (v === "false") obj[h] = false
      else if (v === "null" || v === "") obj[h] = null
      else if (!isNaN(Number(v)) && v !== "") obj[h] = Number(v)
      else if (h === "options") {
        try {
          obj[h] = JSON.parse(v)
        } catch {
          obj[h] = v.split("|")
        }
      } else obj[h] = v
    })
    return obj
  })
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error("Usage: npx ts-node scripts/importQuestions.ts <path-to-file.json|.csv>")
    process.exit(1)
  }

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!serviceAccount) {
    console.error("FIREBASE_ADMIN_SERVICE_ACCOUNT env var is not set")
    process.exit(1)
  }

  const content = readFileSync(resolve(process.cwd(), filePath), "utf-8")
  const isCsv = filePath.endsWith(".csv")
  const raw: RawQuestion[] = isCsv ? parseCsv(content) : (JSON.parse(content) as RawQuestion[])

  console.log(`Loaded ${raw.length} records from ${filePath}`)

  // Validate
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema)
  const valid: RawQuestion[] = []
  let invalidCount = 0

  for (let i = 0; i < raw.length; i++) {
    const q = raw[i]!
    if (validate(q)) {
      valid.push(q)
    } else {
      invalidCount++
      console.warn(`Record ${i + 1} invalid:`, validate.errors?.map((e) => e.message).join("; "))
    }
  }

  console.log(`Valid: ${valid.length} | Invalid (skipped): ${invalidCount}`)
  if (valid.length === 0) {
    console.error("No valid questions to import.")
    process.exit(1)
  }

  // Init Firebase Admin
  initializeApp({ credential: cert(JSON.parse(serviceAccount) as object) })
  const db = getFirestore()

  // Batch write
  let batches = 0
  let written = 0

  for (let i = 0; i < valid.length; i += BATCH_SIZE) {
    const chunk = valid.slice(i, i + BATCH_SIZE)
    const batch: WriteBatch = db.batch()

    for (const q of chunk) {
      const id = (q.question_id as string) || `q-${Date.now()}-${Math.random()}`
      const ref = db.collection("questions").doc(id)
      batch.set(ref, { ...q, created_at: new Date() })
    }

    await batch.commit()
    batches++
    written += chunk.length
    console.log(`Batch ${batches}: wrote ${chunk.length} questions (total ${written})`)
  }

  console.log(`Done. ${written} questions imported in ${batches} batches.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
