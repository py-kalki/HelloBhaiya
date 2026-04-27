export type SubjectChapter = {
  id: string
  name: string
}

export type SubjectData = {
  name: string
  chapters: SubjectChapter[]
}

export const NEET_SYLLABUS: SubjectData[] = [
  {
    name: "Physics",
    chapters: [
      { id: "physics-units-measurement", name: "Units & Measurement" },
      { id: "physics-motion-straight-line", name: "Motion in a Straight Line" },
      { id: "physics-motion-plane", name: "Motion in a Plane" },
      { id: "physics-laws-of-motion", name: "Laws of Motion" },
      { id: "physics-work-energy-power", name: "Work, Energy & Power" },
      { id: "physics-rotational-motion", name: "Rotational Motion" },
      { id: "physics-gravitation", name: "Gravitation" },
      { id: "physics-mechanical-properties-solids", name: "Mechanical Properties of Solids" },
      { id: "physics-mechanical-properties-fluids", name: "Mechanical Properties of Fluids" },
      { id: "physics-thermal-properties", name: "Thermal Properties of Matter" },
      { id: "physics-thermodynamics", name: "Thermodynamics" },
      { id: "physics-kinetic-theory", name: "Kinetic Theory of Gases" },
      { id: "physics-oscillations", name: "Oscillations" },
      { id: "physics-waves", name: "Waves" },
      { id: "physics-electrostatics", name: "Electrostatics" },
      { id: "physics-current-electricity", name: "Current Electricity" },
      { id: "physics-moving-charges", name: "Moving Charges & Magnetism" },
      { id: "physics-magnetism-matter", name: "Magnetism & Matter" },
      { id: "physics-electromagnetic-induction", name: "Electromagnetic Induction" },
      { id: "physics-alternating-current", name: "Alternating Current" },
      { id: "physics-electromagnetic-waves", name: "Electromagnetic Waves" },
      { id: "physics-ray-optics", name: "Ray Optics" },
      { id: "physics-wave-optics", name: "Wave Optics" },
      { id: "physics-dual-nature", name: "Dual Nature of Radiation & Matter" },
      { id: "physics-atoms", name: "Atoms" },
      { id: "physics-nuclei", name: "Nuclei" },
      { id: "physics-semiconductor-devices", name: "Semiconductor Devices" },
    ],
  },
  {
    name: "Chemistry",
    chapters: [
      { id: "chem-some-basic-concepts", name: "Some Basic Concepts of Chemistry" },
      { id: "chem-structure-of-atom", name: "Structure of Atom" },
      { id: "chem-classification-elements", name: "Classification of Elements & Periodicity" },
      { id: "chem-chemical-bonding", name: "Chemical Bonding & Molecular Structure" },
      { id: "chem-states-of-matter", name: "States of Matter" },
      { id: "chem-thermodynamics", name: "Thermodynamics" },
      { id: "chem-equilibrium", name: "Equilibrium" },
      { id: "chem-redox-reactions", name: "Redox Reactions" },
      { id: "chem-hydrogen", name: "Hydrogen" },
      { id: "chem-s-block", name: "s-Block Elements" },
      { id: "chem-p-block-1", name: "p-Block Elements (Group 13–14)" },
      { id: "chem-organic-basic", name: "Basic Principles of Organic Chemistry" },
      { id: "chem-hydrocarbons", name: "Hydrocarbons" },
      { id: "chem-environmental-chemistry", name: "Environmental Chemistry" },
      { id: "chem-solid-state", name: "Solid State" },
      { id: "chem-solutions", name: "Solutions" },
      { id: "chem-electrochemistry", name: "Electrochemistry" },
      { id: "chem-chemical-kinetics", name: "Chemical Kinetics" },
      { id: "chem-surface-chemistry", name: "Surface Chemistry" },
      { id: "chem-general-principles-metals", name: "General Principles of Metallurgy" },
      { id: "chem-p-block-2", name: "p-Block Elements (Group 15–18)" },
      { id: "chem-d-f-block", name: "d & f Block Elements" },
      { id: "chem-coordination-compounds", name: "Coordination Compounds" },
      { id: "chem-haloalkanes-haloarenes", name: "Haloalkanes & Haloarenes" },
      { id: "chem-alcohols-phenols-ethers", name: "Alcohols, Phenols & Ethers" },
      { id: "chem-aldehydes-ketones", name: "Aldehydes, Ketones & Carboxylic Acids" },
      { id: "chem-amines", name: "Amines" },
      { id: "chem-biomolecules", name: "Biomolecules" },
      { id: "chem-polymers", name: "Polymers" },
      { id: "chem-chemistry-everyday", name: "Chemistry in Everyday Life" },
    ],
  },
  {
    name: "Biology",
    chapters: [
      { id: "bio-living-world", name: "The Living World" },
      { id: "bio-biological-classification", name: "Biological Classification" },
      { id: "bio-plant-kingdom", name: "Plant Kingdom" },
      { id: "bio-animal-kingdom", name: "Animal Kingdom" },
      { id: "bio-morphology-plants", name: "Morphology of Flowering Plants" },
      { id: "bio-anatomy-plants", name: "Anatomy of Flowering Plants" },
      { id: "bio-structural-animals", name: "Structural Organisation in Animals" },
      { id: "bio-cell-unit", name: "Cell: The Unit of Life" },
      { id: "bio-biomolecules", name: "Biomolecules" },
      { id: "bio-cell-cycle", name: "Cell Cycle & Cell Division" },
      { id: "bio-transport-plants", name: "Transport in Plants" },
      { id: "bio-mineral-nutrition", name: "Mineral Nutrition" },
      { id: "bio-photosynthesis", name: "Photosynthesis in Higher Plants" },
      { id: "bio-respiration-plants", name: "Respiration in Plants" },
      { id: "bio-plant-growth", name: "Plant Growth & Development" },
      { id: "bio-digestion-absorption", name: "Digestion & Absorption" },
      { id: "bio-breathing-gaseous-exchange", name: "Breathing & Exchange of Gases" },
      { id: "bio-body-fluids-circulation", name: "Body Fluids & Circulation" },
      { id: "bio-excretory-products", name: "Excretory Products & Elimination" },
      { id: "bio-locomotion-movement", name: "Locomotion & Movement" },
      { id: "bio-neural-control", name: "Neural Control & Coordination" },
      { id: "bio-chemical-coordination", name: "Chemical Coordination & Integration" },
      { id: "bio-sexual-reproduction-plants", name: "Sexual Reproduction in Flowering Plants" },
      { id: "bio-human-reproduction", name: "Human Reproduction" },
      { id: "bio-reproductive-health", name: "Reproductive Health" },
      { id: "bio-principles-inheritance", name: "Principles of Inheritance & Variation" },
      { id: "bio-molecular-basis-inheritance", name: "Molecular Basis of Inheritance" },
      { id: "bio-evolution", name: "Evolution" },
      { id: "bio-human-health-disease", name: "Human Health & Disease" },
      { id: "bio-strategies-enhancement", name: "Strategies for Enhancement in Food Production" },
      { id: "bio-microbes-human-welfare", name: "Microbes in Human Welfare" },
      { id: "bio-biotechnology-principles", name: "Biotechnology: Principles & Processes" },
      { id: "bio-biotechnology-applications", name: "Biotechnology & its Applications" },
      { id: "bio-organisms-populations", name: "Organisms & Populations" },
      { id: "bio-ecosystem", name: "Ecosystem" },
      { id: "bio-biodiversity-conservation", name: "Biodiversity & Conservation" },
      { id: "bio-environmental-issues", name: "Environmental Issues" },
    ],
  },
]

export const JEE_SYLLABUS: SubjectData[] = [
  {
    name: "Physics",
    chapters: NEET_SYLLABUS[0]!.chapters,
  },
  {
    name: "Chemistry",
    chapters: NEET_SYLLABUS[1]!.chapters,
  },
  {
    name: "Mathematics",
    chapters: [
      { id: "math-sets-relations", name: "Sets, Relations & Functions" },
      { id: "math-complex-numbers", name: "Complex Numbers & Quadratic Equations" },
      { id: "math-matrices-determinants", name: "Matrices & Determinants" },
      { id: "math-permutations-combinations", name: "Permutations & Combinations" },
      { id: "math-mathematical-induction", name: "Mathematical Induction" },
      { id: "math-binomial-theorem", name: "Binomial Theorem" },
      { id: "math-sequences-series", name: "Sequences & Series" },
      { id: "math-limit-continuity", name: "Limit, Continuity & Differentiability" },
      { id: "math-integral-calculus", name: "Integral Calculus" },
      { id: "math-differential-equations", name: "Differential Equations" },
      { id: "math-coordinate-geometry", name: "Coordinate Geometry" },
      { id: "math-3d-geometry", name: "Three Dimensional Geometry" },
      { id: "math-vector-algebra", name: "Vector Algebra" },
      { id: "math-statistics-probability", name: "Statistics & Probability" },
      { id: "math-trigonometry", name: "Trigonometry" },
      { id: "math-mathematical-reasoning", name: "Mathematical Reasoning" },
    ],
  },
]

export function getSyllabus(exam: string): SubjectData[] {
  if (exam === "NEET") return NEET_SYLLABUS
  if (exam === "JEE_MAINS" || exam === "JEE_ADV") return JEE_SYLLABUS
  return NEET_SYLLABUS
}
