const fs = require('fs');

const htmlContent = fs.readFileSync('../neet_complete_syllabus.html', 'utf8');

// Extract the script block containing the data
const match = htmlContent.match(/const data = (\{[\s\S]*?\});/);

if (!match) {
  console.error("Could not find data in HTML file.");
  process.exit(1);
}

// Evaluate the data object
const data = eval("(" + match[1] + ")");

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const NEET_SYLLABUS = [];

// Process Physics
const phyChapters = data.phy.chapters.map(ch => ({
  id: `physics-${toSlug(ch.title)}`,
  name: ch.title,
  topics: ch.topics
}));
NEET_SYLLABUS.push({ name: "Physics", chapters: phyChapters });

// Process Chemistry
const chemChapters = [];
data.chem.sections.forEach(sec => {
  sec.chapters.forEach(ch => {
    chemChapters.push({
      id: `chem-${toSlug(ch.title)}`,
      name: ch.title,
      topics: ch.topics
    });
  });
});
NEET_SYLLABUS.push({ name: "Chemistry", chapters: chemChapters });

// Process Botany
const botChapters = data.bot.chapters.map(ch => ({
  id: `bio-${toSlug(ch.title)}`,
  name: ch.title,
  topics: ch.topics
}));

// Process Zoology
const zooChapters = data.zoo.chapters.map(ch => ({
  id: `zoo-${toSlug(ch.title)}`,
  name: ch.title,
  topics: ch.topics
}));

// Combine Botany and Zoology into Biology
// Wait, the prompt says: "NEET shows Physics/Chemistry/Botany/Zoology; JEE shows Physics/Chemistry/Maths"
// Let's modify the NEET_SYLLABUS structure to have Physics, Chemistry, Botany, Zoology separately?
// Currently HelloBhaiya uses Physics, Chemistry, Biology. The user said:
// "NEET shows Physics/Chemistry/Botany/Zoology; JEE shows Physics/Chemistry/Maths"
// So let's make NEET_SYLLABUS have Physics, Chemistry, Botany, Zoology!
NEET_SYLLABUS.push({ name: "Botany", chapters: botChapters });
NEET_SYLLABUS.push({ name: "Zoology", chapters: zooChapters });

const JEE_SYLLABUS = [
  { name: "Physics", chapters: phyChapters },
  { name: "Chemistry", chapters: chemChapters },
  { name: "Mathematics", chapters: [
    { id: "math-sets-relations", name: "Sets, Relations & Functions", topics: ["Sets", "Relations", "Functions"] },
    { id: "math-complex-numbers", name: "Complex Numbers & Quadratic Equations", topics: ["Complex Numbers", "Quadratic Equations"] },
    { id: "math-matrices-determinants", name: "Matrices & Determinants", topics: ["Matrices", "Determinants"] },
    { id: "math-permutations-combinations", name: "Permutations & Combinations", topics: ["Permutations", "Combinations"] },
    { id: "math-mathematical-induction", name: "Mathematical Induction", topics: ["Principle of Mathematical Induction"] },
    { id: "math-binomial-theorem", name: "Binomial Theorem", topics: ["Binomial Theorem", "Simple Applications"] },
    { id: "math-sequences-series", name: "Sequences & Series", topics: ["Arithmetic Progression", "Geometric Progression", "Harmonic Progression"] },
    { id: "math-limit-continuity", name: "Limit, Continuity & Differentiability", topics: ["Limits", "Continuity", "Differentiability"] },
    { id: "math-integral-calculus", name: "Integral Calculus", topics: ["Indefinite Integrals", "Definite Integrals", "Area Under Curves"] },
    { id: "math-differential-equations", name: "Differential Equations", topics: ["Ordinary Differential Equations", "Linear Differential Equations"] },
    { id: "math-coordinate-geometry", name: "Coordinate Geometry", topics: ["Straight Lines", "Circles", "Conic Sections"] },
    { id: "math-3d-geometry", name: "Three Dimensional Geometry", topics: ["Direction Cosines", "Lines in Space", "Planes"] },
    { id: "math-vector-algebra", name: "Vector Algebra", topics: ["Vectors", "Addition of Vectors", "Product of Vectors"] },
    { id: "math-statistics-probability", name: "Statistics & Probability", topics: ["Measures of Dispersion", "Probability"] },
    { id: "math-trigonometry", name: "Trigonometry", topics: ["Trigonometric Functions", "Trigonometric Equations", "Inverse Trigonometric Functions", "Heights and Distances"] },
    { id: "math-mathematical-reasoning", name: "Mathematical Reasoning", topics: ["Statements", "Logical Operations"] }
  ]}
];

const output = `export type SubjectChapter = {
  id: string
  name: string
  topics?: string[]
}

export type SubjectData = {
  name: string
  chapters: SubjectChapter[]
}

export const NEET_SYLLABUS: SubjectData[] = ${JSON.stringify(NEET_SYLLABUS, null, 2)};

export const JEE_SYLLABUS: SubjectData[] = ${JSON.stringify(JEE_SYLLABUS, null, 2)};

export function getSyllabus(exam: string): SubjectData[] {
  if (exam === "NEET") return NEET_SYLLABUS
  if (exam === "JEE_MAINS" || exam === "JEE_ADV") return JEE_SYLLABUS
  return NEET_SYLLABUS
}
`;

fs.writeFileSync('lib/syllabusData.ts', output);
console.log("Successfully generated lib/syllabusData.ts");
