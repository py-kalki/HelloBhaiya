/**
 * convertPhysicsQuestions.js
 * reads the neet_physics_200_questions.html, pulls the questions[] array,
 * and spits out a properly formatted JSON file matching questionSchema.json
 *
 * run with:  node scripts/convertPhysicsQuestions.js
 */

const fs = require('fs')
const path = require('path')

const HTML_PATH = path.resolve(__dirname, '../../neet_physics_200_questions.html')
const OUT_PATH  = path.resolve(__dirname, 'data/neet_physics_questions.json')

// chapter → { chapter_id, chapter_name, unit }
const CHAPTER_MAP = {
  'Kinematics':             { id: 'phy-kinematics',              name: 'Kinematics',                                      unit: 'Kinematics' },
  'Laws of Motion':         { id: 'phy-laws-of-motion',          name: 'Laws of Motion',                                  unit: 'Laws of Motion' },
  'Work Energy Power':      { id: 'phy-work-energy-power',       name: 'Work, Energy and Power',                          unit: 'Work, Energy and Power' },
  'Rotational Motion':      { id: 'phy-rotational-motion',       name: 'Rotational Motion',                               unit: 'Rotational Motion' },
  'Gravitation':            { id: 'phy-gravitation',             name: 'Gravitation',                                     unit: 'Gravitation' },
  'Properties of Matter':   { id: 'phy-properties-bulk-matter',  name: 'Properties of Bulk Matter',                       unit: 'Properties of Bulk Matter' },
  'Thermodynamics':         { id: 'phy-thermodynamics',          name: 'Thermodynamics',                                  unit: 'Thermodynamics' },
  'Kinetic Theory':         { id: 'phy-kinetic-theory',          name: 'Kinetic Theory',                                  unit: 'Kinetic Theory of Gases' },
  'Oscillations & Waves':   { id: 'phy-oscillations-waves',      name: 'Oscillations and Waves',                          unit: 'Oscillations and Waves' },
  'Electrostatics':         { id: 'phy-electrostatics',          name: 'Electrostatics',                                  unit: 'Electrostatics' },
  'Current Electricity':    { id: 'phy-current-electricity',     name: 'Current Electricity',                             unit: 'Current Electricity' },
  'Magnetic Effects':       { id: 'phy-magnetic-effects',        name: 'Magnetic Effects of Current and Magnetism',       unit: 'Magnetic Effects of Current and Magnetism' },
  'EMI & AC':               { id: 'phy-electromagnetic-induction', name: 'Electromagnetic Induction and Alternating Currents', unit: 'Electromagnetic Induction & AC' },
  'Electromagnetic Waves':  { id: 'phy-electromagnetic-waves',   name: 'Electromagnetic Waves',                           unit: 'Electromagnetic Waves' },
  'Optics':                 { id: 'phy-optics',                  name: 'Optics',                                          unit: 'Optics' },
  'Dual Nature':            { id: 'phy-dual-nature',             name: 'Dual Nature of Matter and Radiation',             unit: 'Dual Nature of Matter and Radiation' },
  'Atoms & Nuclei':         { id: 'phy-atoms-nuclei',            name: 'Atoms and Nuclei',                                unit: 'Atoms and Nuclei' },
  'Electronic Devices':     { id: 'phy-electronic-devices',      name: 'Electronic Devices',                              unit: 'Electronic Devices' },
}

function extractYear(text) {
  const m = text.match(/\[PYQ\s+(\d{4})\]/i)
  return m ? parseInt(m[1]) : null
}

function cleanText(text) {
  // strip the [PYQ YYYY] prefix from question text
  return text.replace(/^\[PYQ\s+\d{4}\]\s*/i, '').trim()
}

function main() {
  const html = fs.readFileSync(HTML_PATH, 'utf-8')

  // pull out the const questions = [...] block
  const match = html.match(/const questions\s*=\s*(\[[\s\S]*?\]);/)
  if (!match) {
    console.error('Could not find questions array in the HTML file')
    process.exit(1)
  }

  let raw
  try {
    raw = JSON.parse(match[1])
  } catch (e) {
    console.error('Failed to parse questions JSON:', e.message)
    process.exit(1)
  }

  console.log(`Found ${raw.length} raw questions`)

  const out = []
  const skipped = []

  for (const q of raw) {
    const chap = CHAPTER_MAP[q.chapter]
    if (!chap) {
      skipped.push({ id: q.id, reason: `unknown chapter: "${q.chapter}"` })
      continue
    }

    const isPyq   = q.pyq === 'yes'
    const pyqYear = isPyq ? extractYear(q.text) : null

    // HTML has Theory/Numerical — both have 4 options so they're MCQ_SINGLE
    // "Numerical" in NEET context here means calculation-based, not free-response
    const qType = 'MCQ_SINGLE'

    const questionId = `phy-q-${String(q.id).padStart(3, '0')}`

    // derive a topic from the first matching syllabus topic or just use chapter name
    // keeping it simple — just use chapter name as topic fallback
    const topic = chap.name

    out.push({
      question_id:    questionId,
      exam:           'NEET',
      subject:        'Physics',
      unit:           chap.unit,
      chapter:        chap.name,
      chapter_id:     chap.id,
      topic:          topic,
      type:           qType,
      difficulty:     q.diff.toUpperCase(),
      question_text:  cleanText(q.text),
      options:        q.options,
      correct_answer: q.answer,
      explanation:    q.explain,
      is_pyq:         isPyq,
      pyq_year:       pyqYear,
      image_url:      null,
    })
  }

  if (skipped.length) {
    console.warn(`Skipped ${skipped.length} questions:`)
    skipped.forEach(s => console.warn(`  #${s.id}: ${s.reason}`))
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8')
  console.log(`\nWrote ${out.length} questions → ${OUT_PATH}`)
  console.log('Next step: node scripts/importQuestions.ts ./scripts/data/neet_physics_questions.json')
}

main()
