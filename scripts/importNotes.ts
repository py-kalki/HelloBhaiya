/**
 * Seed Firestore with initial curated note documents.
 * Usage: npx ts-node --project tsconfig.scripts.json scripts/importNotes.ts
 *
 * Prerequisite: upload the actual PDF files to Firebase Storage and
 * update the pdf_url / thumbnail_url fields below.
 */

import * as admin from "firebase-admin"

const serviceAccount = JSON.parse(process.env["FIREBASE_ADMIN_SERVICE_ACCOUNT"] ?? "{}")

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

const db = admin.firestore()

type SeedNote = {
  note_id: string
  title: string
  subject: string
  chapter_id: string
  type: "HANDWRITTEN" | "TYPED"
  creator_name: string
  creator_handle: string
  source_url: string
  pdf_url: string
  thumbnail_url: string
  aggregate_rating: number
  rating_count: number
  view_count: number
}

const SEED_NOTES: SeedNote[] = [
  {
    note_id: "note-cell-biology-01",
    title: "Cell Biology — Complete NCERT Notes",
    subject: "Biology",
    chapter_id: "bio-cell-unit-of-life",
    type: "TYPED",
    creator_name: "Priya Sharma",
    creator_handle: "@priya_neet",
    source_url: "https://t.me/neetprep",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.7,
    rating_count: 142,
    view_count: 3820,
  },
  {
    note_id: "note-genetics-01",
    title: "Genetics & Molecular Biology — Visual Notes",
    subject: "Biology",
    chapter_id: "bio-principles-inheritance",
    type: "HANDWRITTEN",
    creator_name: "Arjun Verma",
    creator_handle: "@arjun_bio",
    source_url: "https://youtube.com/@arjun_bio",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.5,
    rating_count: 98,
    view_count: 2140,
  },
  {
    note_id: "note-human-physiology-01",
    title: "Human Physiology — Digestion to Nervous System",
    subject: "Biology",
    chapter_id: "bio-digestion-absorption",
    type: "TYPED",
    creator_name: "Neha Gupta",
    creator_handle: "@neha_neet2025",
    source_url: "",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.8,
    rating_count: 211,
    view_count: 5600,
  },
  {
    note_id: "note-mechanics-01",
    title: "Mechanics — Laws of Motion & Work-Energy",
    subject: "Physics",
    chapter_id: "phy-laws-of-motion",
    type: "HANDWRITTEN",
    creator_name: "Rahul Joshi",
    creator_handle: "@rahul_physics",
    source_url: "https://instagram.com/rahul_physics",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.6,
    rating_count: 75,
    view_count: 1980,
  },
  {
    note_id: "note-electrostatics-01",
    title: "Electrostatics — Full Chapter with PYQ Analysis",
    subject: "Physics",
    chapter_id: "phy-electrostatics",
    type: "TYPED",
    creator_name: "Kiran Mehta",
    creator_handle: "@kiran_phy",
    source_url: "",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.9,
    rating_count: 187,
    view_count: 4200,
  },
  {
    note_id: "note-optics-01",
    title: "Optics — Wave & Ray Optics Combined",
    subject: "Physics",
    chapter_id: "phy-optics",
    type: "TYPED",
    creator_name: "Vikram Singh",
    creator_handle: "@vikram_neet",
    source_url: "",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.4,
    rating_count: 63,
    view_count: 1540,
  },
  {
    note_id: "note-organic-basic-01",
    title: "Organic Chemistry — Reactions Master Sheet",
    subject: "Chemistry",
    chapter_id: "chem-organic-principles",
    type: "HANDWRITTEN",
    creator_name: "Ananya Das",
    creator_handle: "@ananya_chem",
    source_url: "https://t.me/chemistry_neet",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.7,
    rating_count: 156,
    view_count: 3900,
  },
  {
    note_id: "note-thermodynamics-chem-01",
    title: "Chemical Thermodynamics — Detailed Notes",
    subject: "Chemistry",
    chapter_id: "chem-thermodynamics",
    type: "TYPED",
    creator_name: "Suresh Pillai",
    creator_handle: "@suresh_chem",
    source_url: "",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.3,
    rating_count: 49,
    view_count: 1200,
  },
  {
    note_id: "note-coordination-01",
    title: "Coordination Compounds — Full NCERT + Extra",
    subject: "Chemistry",
    chapter_id: "chem-coordination-compounds",
    type: "TYPED",
    creator_name: "Meera Iyer",
    creator_handle: "@meera_chem",
    source_url: "",
    pdf_url: "",
    thumbnail_url: "",
    aggregate_rating: 4.6,
    rating_count: 82,
    view_count: 2100,
  },
]

async function importNotes() {
  console.log(`Importing ${SEED_NOTES.length} seed notes...`)
  const batch = db.batch()
  for (const note of SEED_NOTES) {
    const ref = db.collection("notes").doc(note.note_id)
    batch.set(ref, { ...note, upload_date: admin.firestore.FieldValue.serverTimestamp() }, { merge: true })
  }
  await batch.commit()
  console.log("Notes import complete.")
}

importNotes().catch((err) => {
  console.error(err)
  process.exit(1)
})
