export type SubjectChapter = {
  id: string
  name: string
  topics?: string[]
}

export type SubjectData = {
  name: string
  chapters: SubjectChapter[]
}

export const NEET_SYLLABUS: SubjectData[] = [
  {
    "name": "Physics",
    "chapters": [
      {
        "id": "physics-physical-world-and-measurement",
        "name": "Physical World and Measurement",
        "topics": [
          "Units of measurements, System of Units, SI Units",
          "Fundamental and derived units",
          "Least count, significant figures",
          "Errors in measurements",
          "Dimensions of physical quantities, dimensional analysis and its applications"
        ]
      },
      {
        "id": "physics-kinematics",
        "name": "Kinematics",
        "topics": [
          "Frame of reference, motion in a straight line",
          "Position-time graph, speed and velocity",
          "Uniform and non-uniform motion, average speed",
          "Uniformly accelerated motion, velocity-time graphs",
          "Scalars and Vectors — addition, subtraction, products",
          "Unit vector, resolution of a vector, relative velocity",
          "Motion in a plane, Projectile motion",
          "Uniform circular motion"
        ]
      },
      {
        "id": "physics-laws-of-motion",
        "name": "Laws of Motion",
        "topics": [
          "Force and inertia, Newton's First law",
          "Momentum, Newton's Second law, impulse",
          "Newton's Third law, conservation of linear momentum",
          "Equilibrium of concurrent forces",
          "Static and kinetic friction, laws of friction, rolling friction",
          "Dynamics of uniform circular motion: centripetal force",
          "Vehicle on level road and banked road"
        ]
      },
      {
        "id": "physics-work-energy-and-power",
        "name": "Work, Energy and Power",
        "topics": [
          "Work done by constant force and variable force",
          "Kinetic and potential energies, work-energy theorem, power",
          "Potential energy of spring, conservation of mechanical energy",
          "Conservative and non-conservative forces",
          "Elastic and inelastic collisions in 1D and 2D",
          "Motion in a vertical circle"
        ]
      },
      {
        "id": "physics-rotational-motion",
        "name": "Rotational Motion",
        "topics": [
          "Centre of mass of two-particle system and rigid body",
          "Basic concepts of rotational motion",
          "Moment of force, torque, angular momentum",
          "Conservation of angular momentum",
          "Moment of inertia, radius of gyration",
          "Values of MI for simple objects",
          "Parallel and perpendicular axes theorems",
          "Equilibrium of rigid bodies, equations of rotational motion"
        ]
      },
      {
        "id": "physics-gravitation",
        "name": "Gravitation",
        "topics": [
          "Universal law of gravitation",
          "Acceleration due to gravity — variation with altitude and depth",
          "Kepler's laws of planetary motion",
          "Gravitational potential energy and gravitational potential",
          "Escape velocity",
          "Motion of a satellite: orbital velocity, time period, energy"
        ]
      },
      {
        "id": "physics-properties-of-solids-and-liquids",
        "name": "Properties of Solids and Liquids",
        "topics": [
          "Elastic behaviour, stress-strain, Hooke's law",
          "Young's modulus, bulk modulus, modulus of rigidity",
          "Pressure due to fluid column, Pascal's law",
          "Viscosity, Stokes' law, terminal velocity",
          "Bernoulli's principle and its applications",
          "Surface tension, angle of contact, capillary rise",
          "Heat, temperature, thermal expansion",
          "Specific heat capacity, calorimetry, latent heat",
          "Heat transfer — conduction, convection, radiation"
        ]
      },
      {
        "id": "physics-thermodynamics",
        "name": "Thermodynamics",
        "topics": [
          "Thermal equilibrium, zeroth law, concept of temperature",
          "Heat, work, internal energy",
          "First law of thermodynamics, isothermal and adiabatic processes",
          "Second law of thermodynamics",
          "Reversible and irreversible processes"
        ]
      },
      {
        "id": "physics-kinetic-theory-of-gases",
        "name": "Kinetic Theory of Gases",
        "topics": [
          "Equation of state of a perfect gas",
          "Kinetic theory — assumptions, concept of pressure",
          "Kinetic interpretation of temperature, RMS speed",
          "Degrees of freedom, law of equipartition of energy",
          "Applications to specific heat capacities of gases",
          "Mean free path, Avogadro's number"
        ]
      },
      {
        "id": "physics-oscillations-and-waves",
        "name": "Oscillations and Waves",
        "topics": [
          "Oscillations: time period, frequency, displacement",
          "Simple harmonic motion (SHM) and its equation",
          "Oscillations of a spring, energy in SHM",
          "Simple pendulum — expression for time period",
          "Wave motion: longitudinal and transverse waves",
          "Speed of travelling wave, superposition principle",
          "Reflection of waves, standing waves",
          "Strings and organ pipes, fundamental mode, harmonics",
          "Beats"
        ]
      },
      {
        "id": "physics-electrostatics",
        "name": "Electrostatics",
        "topics": [
          "Electric charges, conservation of charge, Coulomb's law",
          "Superposition principle, continuous charge distribution",
          "Electric field, field lines, electric dipole",
          "Torque on dipole in uniform electric field",
          "Electric flux, Gauss's law and its applications",
          "Electric potential: point charge, dipole, system of charges",
          "Equipotential surfaces, electrical potential energy",
          "Conductors and insulators, dielectrics, polarization",
          "Capacitors — series and parallel combinations",
          "Parallel plate capacitor, energy stored in capacitor"
        ]
      },
      {
        "id": "physics-current-electricity",
        "name": "Current Electricity",
        "topics": [
          "Electric current, drift velocity, mobility",
          "Ohm's law, electrical resistance",
          "V-I characteristics of ohmic and non-ohmic conductors",
          "Electrical energy and power, resistivity and conductivity",
          "Series and parallel combinations, temperature dependence",
          "Internal resistance, EMF of cell, cells in series and parallel",
          "Kirchhoff's laws, Wheatstone bridge, Metre bridge"
        ]
      },
      {
        "id": "physics-magnetic-effects-of-current-and-magnetism",
        "name": "Magnetic Effects of Current and Magnetism",
        "topics": [
          "Biot-Savart law, circular loop",
          "Ampere's law — long wire and solenoid",
          "Force on moving charge in electric and magnetic fields",
          "Force on current-carrying conductor in magnetic field",
          "Force between two parallel currents, definition of ampere",
          "Torque on current loop, moving coil galvanometer",
          "Conversion to ammeter and voltmeter",
          "Current loop as magnetic dipole",
          "Bar magnet — equivalent solenoid, magnetic field lines",
          "Para-, dia-, and ferromagnetic substances",
          "Effect of temperature on magnetic properties"
        ]
      },
      {
        "id": "physics-electromagnetic-induction-and-ac",
        "name": "Electromagnetic Induction and AC",
        "topics": [
          "Electromagnetic induction, Faraday's law",
          "Induced EMF and current, Lenz's law, eddy currents",
          "Self and mutual inductance",
          "Alternating currents, peak and RMS values",
          "Reactance and impedance",
          "LCR series circuit, resonance",
          "Power in AC circuits, wattless current",
          "AC generator and transformer"
        ]
      },
      {
        "id": "physics-electromagnetic-waves",
        "name": "Electromagnetic Waves",
        "topics": [
          "Displacement current",
          "Electromagnetic waves and their characteristics",
          "Transverse nature of EM waves",
          "EM spectrum: radio, microwave, infrared, visible, UV, X-ray, gamma",
          "Applications of EM waves"
        ]
      },
      {
        "id": "physics-optics",
        "name": "Optics",
        "topics": [
          "Reflection of light, spherical mirrors, mirror formula",
          "Refraction at plane and spherical surfaces, thin lens formula",
          "Lens maker's formula, total internal reflection",
          "Magnification, power of lens, combination of lenses",
          "Refraction through prism",
          "Microscope and astronomical telescope",
          "Wave optics: wavefront, Huygens' principle",
          "Interference, Young's double slit experiment, fringe width",
          "Diffraction due to single slit",
          "Polarization, Brewster's law, polaroids"
        ]
      },
      {
        "id": "physics-dual-nature-of-matter-and-radiation",
        "name": "Dual Nature of Matter and Radiation",
        "topics": [
          "Dual nature of radiation, photoelectric effect",
          "Hertz and Lenard's observations",
          "Einstein's photoelectric equation, particle nature of light",
          "Matter waves, de Broglie relation"
        ]
      },
      {
        "id": "physics-atoms-and-nuclei",
        "name": "Atoms and Nuclei",
        "topics": [
          "Alpha-particle scattering, Rutherford's model",
          "Bohr model, energy levels, hydrogen spectrum",
          "Composition and size of nucleus, atomic masses",
          "Mass-energy relation, mass defect",
          "Binding energy per nucleon",
          "Nuclear fission and fusion"
        ]
      },
      {
        "id": "physics-electronic-devices",
        "name": "Electronic Devices",
        "topics": [
          "Semiconductors, semiconductor diode",
          "I-V characteristics: forward and reverse bias",
          "Diode as rectifier",
          "LED, photodiode, solar cell, Zener diode",
          "Zener diode as voltage regulator",
          "Logic gates: OR, AND, NOT, NAND, NOR"
        ]
      },
      {
        "id": "physics-experimental-skills",
        "name": "Experimental Skills",
        "topics": [
          "Vernier callipers — internal/external diameter, depth",
          "Screw gauge — thickness/diameter of sheet/wire",
          "Simple pendulum — energy dissipation",
          "Metre scale — principle of moments",
          "Young's modulus of metallic wire",
          "Surface tension — capillary rise, effect of detergents",
          "Coefficient of viscosity — terminal velocity",
          "Speed of sound in air — resonance tube",
          "Specific heat capacity — method of mixtures",
          "Resistivity — metre bridge, Ohm's law",
          "Galvanometer — half deflection method",
          "Focal length of concave/convex mirror, convex lens",
          "Angle of deviation vs angle of incidence — prism",
          "Refractive index of glass slab",
          "p-n junction diode — forward/reverse bias curves",
          "Zener diode characteristics",
          "Identification of diode, LED, transistor, IC, resistor, capacitor"
        ]
      }
    ]
  },
  {
    "name": "Chemistry",
    "chapters": [
      {
        "id": "chem-some-basic-concepts-of-chemistry",
        "name": "Some Basic Concepts of Chemistry",
        "topics": [
          "Matter and its nature, Dalton's atomic theory",
          "Concept of atom, molecule, element, compound",
          "Laws of chemical combination",
          "Atomic and molecular masses, mole concept, molar mass",
          "Percentage composition, empirical and molecular formulae",
          "Chemical equations and stoichiometry"
        ]
      },
      {
        "id": "chem-structure-of-atom",
        "name": "Structure of Atom",
        "topics": [
          "Nature of electromagnetic radiation, photoelectric effect",
          "Spectrum of hydrogen atom",
          "Bohr model — postulates, energy of electron, radii of orbits, limitations",
          "Dual nature of matter, de Broglie's relationship",
          "Heisenberg uncertainty principle",
          "Quantum mechanical model of atom",
          "Atomic orbitals — variation of ψ and ψ² with r",
          "Quantum numbers (principal, angular, magnetic)",
          "Shapes of s, p, d orbitals",
          "Electron spin and spin quantum number",
          "Aufbau principle, Pauli's exclusion principle, Hund's rule",
          "Electronic configuration, extra stability of half-filled/filled orbitals"
        ]
      },
      {
        "id": "chem-chemical-bonding-and-molecular-structure",
        "name": "Chemical Bonding and Molecular Structure",
        "topics": [
          "Kossel–Lewis approach to chemical bonding",
          "Ionic bonding: formation, factors, lattice enthalpy",
          "Covalent bonding: electronegativity, Fajan's rule, dipole moment",
          "VSEPR theory and shapes of molecules",
          "Valence bond theory: hybridization (s, p, d orbitals), resonance",
          "Molecular orbital theory: LCAOs, bonding/antibonding MOs",
          "Sigma and pi bonds, MO electronic configurations",
          "Bond order, bond length, bond energy",
          "Metallic bonding, hydrogen bonding and applications"
        ]
      },
      {
        "id": "chem-chemical-thermodynamics",
        "name": "Chemical Thermodynamics",
        "topics": [
          "System and surroundings, extensive/intensive properties, state functions",
          "Types of processes",
          "First law: work, heat, internal energy, enthalpy, heat capacity",
          "Hess's law of constant heat summation",
          "Enthalpies of bond dissociation, combustion, formation, atomization",
          "Sublimation, phase transition, hydration, ionization, solution",
          "Second law: spontaneity, ΔS of universe, ΔG of system",
          "Standard Gibbs energy change and equilibrium constant"
        ]
      },
      {
        "id": "chem-solutions",
        "name": "Solutions",
        "topics": [
          "Methods for expressing concentration: molality, molarity, mole fraction, %",
          "Vapour pressure of solutions, Raoult's law",
          "Ideal and non-ideal solutions, vapour pressure–composition plots",
          "Colligative properties: lowering of vapour pressure",
          "Depression of freezing point, elevation of boiling point",
          "Osmotic pressure",
          "Determination of molecular mass from colligative properties",
          "Abnormal molar mass, van't Hoff factor"
        ]
      },
      {
        "id": "chem-equilibrium",
        "name": "Equilibrium",
        "topics": [
          "Concept of dynamic equilibrium",
          "Physical equilibria: solid-liquid, liquid-gas, solid-gas",
          "Henry's law",
          "Chemical equilibrium: law of equilibrium, Kp and Kc",
          "ΔG and ΔG° in chemical equilibrium",
          "Factors affecting equilibrium: Le Chatelier's principle",
          "Ionic equilibrium: weak/strong electrolytes",
          "Bronsted-Lowry and Lewis acid-base concepts",
          "Acid-base equilibria, ionization constants",
          "pH scale, common ion effect",
          "Hydrolysis of salts, solubility product, buffer solutions"
        ]
      },
      {
        "id": "chem-redox-reactions-and-electrochemistry",
        "name": "Redox Reactions and Electrochemistry",
        "topics": [
          "Electronic concepts of oxidation and reduction",
          "Oxidation number, rules for assigning, balancing redox reactions",
          "Electrolytic and metallic conduction",
          "Molar conductivities, Kohlrausch's law",
          "Electrochemical cells: electrolytic and galvanic",
          "Electrode potentials, standard electrode potential",
          "Half-cell and cell reactions, EMF and its measurement",
          "Nernst equation and applications",
          "Relationship between cell potential and Gibbs energy",
          "Dry cell, lead accumulator, fuel cells"
        ]
      },
      {
        "id": "chem-chemical-kinetics",
        "name": "Chemical Kinetics",
        "topics": [
          "Rate of reaction, factors affecting rate",
          "Elementary and complex reactions",
          "Order and molecularity of reactions, rate law",
          "Rate constant and its units",
          "Zero and first-order reactions: differential and integral forms",
          "Half-lives of reactions",
          "Effect of temperature on rate, Arrhenius theory",
          "Activation energy and its calculation",
          "Collision theory of bimolecular gaseous reactions"
        ]
      },
      {
        "id": "chem-classification-of-elements-and-periodicity",
        "name": "Classification of Elements and Periodicity",
        "topics": [
          "Modern periodic law, present form of periodic table",
          "s, p, d and f block elements",
          "Periodic trends: atomic/ionic radii, ionization enthalpy",
          "Electron gain enthalpy, valence, oxidation states",
          "Chemical reactivity"
        ]
      },
      {
        "id": "chem-p-block-elements",
        "name": "p-Block Elements",
        "topics": [
          "Groups 13–18 elements",
          "Electronic configuration and general trends",
          "Physical and chemical properties across periods and down groups",
          "Unique behaviour of first element in each group"
        ]
      },
      {
        "id": "chem-d-and-f-block-elements",
        "name": "d- and f-Block Elements",
        "topics": [
          "Transition elements: general introduction, electronic configuration",
          "General trends: physical properties, ionization enthalpy, oxidation states",
          "Atomic radii, colour, catalytic behaviour, magnetic properties",
          "Complex formation, interstitial compounds, alloy formation",
          "Preparation, properties and uses of K₂Cr₂O₇ and KMnO₄",
          "Lanthanoids: electronic configuration, oxidation states, lanthanoid contraction",
          "Actinoids: electronic configuration and oxidation states"
        ]
      },
      {
        "id": "chem-coordination-compounds",
        "name": "Coordination Compounds",
        "topics": [
          "Introduction, Werner's theory",
          "Ligands, coordination number, denticity, chelation",
          "IUPAC nomenclature of mononuclear coordination compounds",
          "Isomerism in coordination compounds",
          "Valence bond approach, crystal field theory (basics)",
          "Colour and magnetic properties",
          "Importance in qualitative analysis, extraction of metals, biological systems"
        ]
      },
      {
        "id": "chem-purification-and-characterisation-of-organic-compounds",
        "name": "Purification and Characterisation of Organic Compounds",
        "topics": [
          "Purification methods: crystallization, sublimation, distillation",
          "Differential extraction, chromatography — principles and applications",
          "Qualitative analysis: detection of N, S, P, halogens",
          "Quantitative analysis: estimation of C, H, N, halogens, S, P",
          "Calculation of empirical and molecular formulae"
        ]
      },
      {
        "id": "chem-basic-principles-of-organic-chemistry",
        "name": "Basic Principles of Organic Chemistry",
        "topics": [
          "Tetravalency of carbon, hybridization (s and p)",
          "Classification of organic compounds by functional groups",
          "Homologous series, structural and stereoisomerism",
          "Nomenclature: trivial and IUPAC",
          "Covalent bond fission: homolytic, heterolytic",
          "Free radicals, carbocations, carbanions",
          "Stability of carbocations, electrophiles and nucleophiles",
          "Electronic displacement: inductive, electromeric, resonance, hyperconjugation",
          "Substitution, addition, elimination, rearrangement reactions"
        ]
      },
      {
        "id": "chem-hydrocarbons",
        "name": "Hydrocarbons",
        "topics": [
          "Classification, isomerism, IUPAC nomenclature",
          "Alkanes: conformations, Sawhorse and Newman projections, halogenation mechanism",
          "Alkenes: geometrical isomerism, electrophilic addition mechanism",
          "Addition of H₂, halogens, water, HX (Markovnikov's rule, peroxide effect)",
          "Ozonolysis, polymerization of alkenes",
          "Alkynes: acidic character, addition reactions, polymerization",
          "Aromatic hydrocarbons: nomenclature, benzene structure, aromaticity",
          "Electrophilic substitution: halogenation, nitration, Friedel–Crafts reactions",
          "Directive influence of functional groups in mono-substituted benzene"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-halogens",
        "name": "Organic Compounds Containing Halogens",
        "topics": [
          "General methods of preparation, properties, reactions",
          "Nature of C–X bond, mechanisms of substitution",
          "Uses and environmental effects of chloroform, iodoform, freons, DDT"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-oxygen",
        "name": "Organic Compounds Containing Oxygen",
        "topics": [
          "Alcohols, phenols, ethers: preparation, properties, reactions",
          "Identification of primary, secondary, tertiary alcohols",
          "Mechanism of dehydration of alcohols",
          "Phenols: acidic nature, electrophilic substitution (halogenation, nitration, sulphonation)",
          "Reimer–Tiemann reaction",
          "Ethers: structure",
          "Aldehydes and ketones: carbonyl group, nucleophilic addition",
          "Addition of HCN, NH₃ and derivatives, Grignard reagent",
          "Oxidation, reduction (Wolff–Kishner and Clemmensen)",
          "Aldol condensation, Cannizzaro reaction, haloform reaction",
          "Chemical tests to distinguish aldehydes and ketones",
          "Carboxylic acids: acidic strength and factors affecting it"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-nitrogen",
        "name": "Organic Compounds Containing Nitrogen",
        "topics": [
          "Amines: nomenclature, classification, structure, basic character",
          "Identification of primary, secondary, tertiary amines",
          "Diazonium salts: importance in synthetic organic chemistry"
        ]
      },
      {
        "id": "chem-biomolecules",
        "name": "Biomolecules",
        "topics": [
          "Carbohydrates: classification, aldoses and ketoses",
          "Monosaccharides: glucose and fructose",
          "Oligosaccharides: sucrose, lactose, maltose",
          "Proteins: α-amino acids, peptide bond, polypeptides",
          "Primary, secondary, tertiary, quaternary structure of proteins",
          "Denaturation of proteins, enzymes",
          "Vitamins: classification and functions",
          "Nucleic acids: chemical constitution of DNA and RNA",
          "Biological functions of nucleic acids",
          "Hormones: general introduction"
        ]
      },
      {
        "id": "chem-principles-related-to-practical-chemistry",
        "name": "Principles Related to Practical Chemistry",
        "topics": [
          "Detection of extra elements (N, S, halogens) in organic compounds",
          "Detection of functional groups: hydroxyl, carbonyl, carboxyl, amino",
          "Preparation of Mohr's salt, potash alum",
          "Preparation of acetanilide, p-nitroacetanilide, aniline yellow, iodoform",
          "Titrimetric exercises: acids, bases, indicators",
          "Oxalic acid vs KMnO₄, Mohr's salt vs KMnO₄",
          "Qualitative salt analysis: principles of cation and anion identification"
        ]
      }
    ]
  },
  {
    "name": "Botany",
    "chapters": [
      {
        "id": "bio-the-living-world",
        "name": "The Living World",
        "topics": [
          "What is living? Growth, reproduction, metabolism",
          "Biodiversity, nomenclature, taxonomic categories",
          "Species, genus, family, order, class, phylum, kingdom",
          "Taxonomical aids: herbarium, botanical garden, museum, zoological park, key"
        ]
      },
      {
        "id": "bio-biological-classification",
        "name": "Biological Classification",
        "topics": [
          "Five kingdom classification: basis and criteria",
          "Kingdom Monera: archaebacteria and eubacteria",
          "Kingdom Protista: characteristics, examples",
          "Kingdom Fungi: structure, nutrition, reproduction",
          "Kingdom Plantae: overview",
          "Kingdom Animalia: overview",
          "Viruses, viroids, prions and lichens"
        ]
      },
      {
        "id": "bio-plant-kingdom",
        "name": "Plant Kingdom",
        "topics": [
          "Algae: characteristics, classification (Chlorophyceae, Phaeophyceae, Rhodophyceae)",
          "Bryophytes: liverworts and mosses",
          "Pteridophytes: ferns and allies",
          "Gymnosperms: conifers and related groups",
          "Angiosperms: overview",
          "Plant life cycles and alternation of generations"
        ]
      },
      {
        "id": "bio-morphology-of-flowering-plants",
        "name": "Morphology of Flowering Plants",
        "topics": [
          "Root: regions, modifications",
          "Stem: modifications (underground, aerial)",
          "Leaf: simple and compound, venation, phyllotaxy",
          "Inflorescence: racemose and cymose",
          "Flower: parts, symmetry, sexuality",
          "Fruit: true and false fruit, types",
          "Seed: dicotyledonous and monocotyledonous",
          "Description of some important families: Fabaceae, Solanaceae, Liliaceae"
        ]
      },
      {
        "id": "bio-anatomy-of-flowering-plants",
        "name": "Anatomy of Flowering Plants",
        "topics": [
          "Tissues: meristematic and permanent",
          "Simple tissues: parenchyma, collenchyma, sclerenchyma",
          "Complex tissues: xylem and phloem",
          "Anatomy of dicot and monocot root",
          "Anatomy of dicot and monocot stem",
          "Anatomy of dicot and monocot leaf",
          "Secondary growth: vascular cambium, annual rings, heartwood, sapwood"
        ]
      },
      {
        "id": "bio-cell-the-unit-of-life",
        "name": "Cell: The Unit of Life",
        "topics": [
          "Cell theory, overview of cell",
          "Prokaryotic cell: structure",
          "Eukaryotic cell: cell membrane, cell wall",
          "Nucleus: nuclear envelope, nucleoplasm, chromatin, nucleolus",
          "Endomembrane system: ER, Golgi, lysosomes, vacuoles",
          "Mitochondria, plastids, ribosomes, cytoskeleton",
          "Cilia and flagella, centrioles",
          "Comparison of plant and animal cells"
        ]
      },
      {
        "id": "bio-biomolecules",
        "name": "Biomolecules",
        "topics": [
          "Analysis of living tissue: chemical compositions",
          "Biomolecules: primary and secondary metabolites",
          "Proteins: structure and function",
          "Polysaccharides: starch, cellulose, glycogen",
          "Nucleic acids: DNA and RNA structure",
          "Enzymes: chemical nature, classification, properties",
          "Factors affecting enzyme activity",
          "Enzyme inhibition"
        ]
      },
      {
        "id": "bio-cell-cycle-and-cell-division",
        "name": "Cell Cycle and Cell Division",
        "topics": [
          "Cell cycle: phases (G1, S, G2, M)",
          "Mitosis: prophase, metaphase, anaphase, telophase",
          "Cytokinesis in plant and animal cells",
          "Meiosis: meiosis I and meiosis II",
          "Significance of mitosis and meiosis"
        ]
      },
      {
        "id": "bio-transport-in-plants",
        "name": "Transport in Plants",
        "topics": [
          "Means of transport: diffusion, facilitated diffusion, active transport",
          "Plant-water relations: water potential, osmosis, plasmolysis",
          "Absorption of water by roots",
          "Movement of water up the plant: ascent of sap",
          "Transpiration: types, transpiration pull, factors",
          "Uptake and transport of mineral nutrients",
          "Phloem transport: pressure flow hypothesis"
        ]
      },
      {
        "id": "bio-mineral-nutrition",
        "name": "Mineral Nutrition",
        "topics": [
          "Essential mineral elements: macronutrients and micronutrients",
          "Criteria for essentiality",
          "Role of macro- and micronutrients",
          "Deficiency symptoms",
          "Mineral toxicity",
          "Nitrogen metabolism: nitrogen cycle, biological nitrogen fixation",
          "Symbiotic and non-symbiotic fixation"
        ]
      },
      {
        "id": "bio-photosynthesis-in-higher-plants",
        "name": "Photosynthesis in Higher Plants",
        "topics": [
          "Where does photosynthesis take place? Chloroplast structure",
          "Pigments involved in photosynthesis",
          "Light reactions: photolysis of water, electron transport, ATP and NADPH",
          "Light-dependent (PS I and PS II)",
          "Calvin cycle (dark reactions): CO₂ fixation, RuBisCO",
          "Photorespiration",
          "C4 pathway (Hatch-Slack cycle)",
          "CAM photosynthesis",
          "Factors affecting photosynthesis"
        ]
      },
      {
        "id": "bio-respiration-in-plants",
        "name": "Respiration in Plants",
        "topics": [
          "Glycolysis: stepwise reactions",
          "Fermentation: types and significance",
          "Aerobic respiration: pyruvate oxidation, Krebs cycle",
          "Electron transport chain and oxidative phosphorylation",
          "Energy yield: ATP count from glucose",
          "Respiratory quotient",
          "Amphibolic pathway"
        ]
      },
      {
        "id": "bio-plant-growth-and-development",
        "name": "Plant Growth and Development",
        "topics": [
          "Growth: definition, phases (meristematic, elongation, maturation)",
          "Growth rates, conditions for growth",
          "Differentiation, dedifferentiation, redifferentiation",
          "Development: plasticity",
          "Plant growth regulators: Auxins, Gibberellins, Cytokinins",
          "Abscisic acid, Ethylene: roles and functions",
          "Photoperiodism: short-day, long-day, day-neutral plants",
          "Vernalisation",
          "Seed dormancy"
        ]
      },
      {
        "id": "bio-reproduction-in-organisms",
        "name": "Reproduction in Organisms",
        "topics": [
          "Modes of reproduction: asexual and sexual",
          "Asexual reproduction: binary fission, budding, fragmentation, spore formation",
          "Vegetative propagation in plants",
          "Sexual reproduction: events — pre-fertilization, fertilization, post-fertilization",
          "Life span of organisms"
        ]
      },
      {
        "id": "bio-sexual-reproduction-in-flowering-plants",
        "name": "Sexual Reproduction in Flowering Plants",
        "topics": [
          "Flower: structure related to sexual reproduction",
          "Stamen: microsporogenesis, pollen grain structure and development",
          "Pistil: megasporogenesis, female gametophyte (embryo sac)",
          "Pollination: types (self and cross-pollination)",
          "Agencies of pollination: wind, water, insects",
          "Outbreeding devices, pollen-pistil interaction",
          "Double fertilization",
          "Post-fertilization: endosperm development",
          "Embryo development in dicots and monocots",
          "Seed and fruit development",
          "Apomixis and polyembryony"
        ]
      },
      {
        "id": "bio-genetics-and-molecular-biology-part-i-mendelian",
        "name": "Genetics and Molecular Biology — Part I (Mendelian)",
        "topics": [
          "Mendel's laws of inheritance",
          "Inheritance of one gene (monohybrid cross), law of dominance",
          "Segregation, test cross",
          "Inheritance of two genes (dihybrid cross), law of independent assortment",
          "Deviations from Mendelism: incomplete dominance, co-dominance",
          "Multiple alleles, ABO blood groups",
          "Pleiotropy, polygenic inheritance",
          "Chromosomal theory of inheritance",
          "Linkage and recombination, sex determination",
          "Mutation: chromosomal and gene mutations",
          "Genetic disorders: Mendelian and chromosomal (Down's, Turner's, Klinefelter's)"
        ]
      },
      {
        "id": "bio-molecular-basis-of-inheritance",
        "name": "Molecular Basis of Inheritance",
        "topics": [
          "DNA as genetic material: evidence (Griffith, Avery, Hershey-Chase)",
          "DNA structure: Watson-Crick double helix model",
          "Packaging of DNA in chromatin",
          "DNA replication: Meselson-Stahl experiment, mechanism",
          "Transcription in prokaryotes and eukaryotes",
          "Genetic code: codons, properties",
          "Translation: ribosomes, tRNAs, polysomes",
          "Regulation of gene expression: lac operon",
          "Human genome project: goals and significance",
          "DNA fingerprinting"
        ]
      },
      {
        "id": "bio-ecology-organisms-and-populations",
        "name": "Ecology — Organisms and Populations",
        "topics": [
          "Ecology: scope, levels of organization",
          "Organisms and their environment: abiotic factors",
          "Responses to abiotic factors: thermoregulation, osmoregulation",
          "Habitat and niche",
          "Population attributes: birth/death rates, age distribution",
          "Population growth: logistic and exponential",
          "Life history variations, population interactions"
        ]
      },
      {
        "id": "bio-ecosystem",
        "name": "Ecosystem",
        "topics": [
          "Ecosystem: structure and function",
          "Productivity: gross and net primary productivity",
          "Decomposition: process and factors affecting it",
          "Energy flow: food chains and food webs, 10% energy law",
          "Ecological pyramids: number, biomass, energy",
          "Ecosystem services",
          "Nutrient cycling: carbon cycle, phosphorus cycle"
        ]
      },
      {
        "id": "bio-biodiversity-and-conservation",
        "name": "Biodiversity and Conservation",
        "topics": [
          "Biodiversity: genetic, species, ecosystem levels",
          "Patterns of biodiversity (latitudinal gradient, species-area relationship)",
          "Loss of biodiversity: causes (HIPPO)",
          "Biodiversity conservation: in situ and ex situ",
          "Hotspots, sacred groves, national parks, biosphere reserves",
          "International conventions: IUCN, CBD"
        ]
      },
      {
        "id": "bio-biotechnology-principles-and-processes",
        "name": "Biotechnology — Principles and Processes",
        "topics": [
          "Principles of biotechnology: genetic engineering, bioprocess engineering",
          "Tools of recombinant DNA technology",
          "Restriction enzymes, cloning vectors (plasmid, bacteriophage)",
          "Competent host, recombinant DNA",
          "Processes: isolation of DNA, gel electrophoresis",
          "PCR: polymerase chain reaction",
          "Cloning and expression of a gene, bioreactors",
          "Downstream processing"
        ]
      },
      {
        "id": "bio-biotechnology-and-its-applications",
        "name": "Biotechnology and Its Applications",
        "topics": [
          "Biotechnological applications in agriculture: Bt cotton, pest-resistant plants",
          "Golden rice, RNA interference",
          "Applications in medicine: insulin, vaccines, gene therapy",
          "Molecular diagnosis: PCR, ELISA",
          "Transgenic animals: purposes and examples",
          "Ethical issues in biotechnology",
          "Biopiracy and patents"
        ]
      }
    ]
  },
  {
    "name": "Zoology",
    "chapters": [
      {
        "id": "zoo-animal-kingdom",
        "name": "Animal Kingdom",
        "topics": [
          "Basis of classification: body plan, symmetry, coelom",
          "Diploblastic and triploblastic organisation",
          "Segmentation, notochord",
          "Classification of animals: Phyla overview",
          "Porifera, Coelenterata, Platyhelminthes, Aschelminthes",
          "Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata",
          "Chordata: Cyclostomata, Chondrichthyes, Osteichthyes",
          "Amphibia, Reptilia, Aves, Mammalia"
        ]
      },
      {
        "id": "zoo-structural-organisation-in-animals",
        "name": "Structural Organisation in Animals",
        "topics": [
          "Tissues: epithelial — squamous, cuboidal, columnar, ciliated, glandular",
          "Connective tissue: types and functions",
          "Muscular tissue: skeletal, smooth, cardiac",
          "Neural tissue: neurons and neuroglia",
          "Brief account of frog: morphology, anatomy",
          "Organ systems of frog: digestive, circulatory, respiratory, nervous, reproductive"
        ]
      },
      {
        "id": "zoo-digestion-and-absorption",
        "name": "Digestion and Absorption",
        "topics": [
          "Alimentary canal: mouth to anus",
          "Digestive glands: salivary, gastric, liver, pancreas",
          "Digestion of carbohydrates, proteins, fats",
          "Absorption: small intestine, mechanisms",
          "Egestion, disorders of digestive system"
        ]
      },
      {
        "id": "zoo-breathing-and-exchange-of-gases",
        "name": "Breathing and Exchange of Gases",
        "topics": [
          "Respiratory organs in animals",
          "Human respiratory system: anatomy",
          "Mechanism of breathing: inspiration and expiration",
          "Respiratory volumes and capacities",
          "Exchange of gases: alveolar diffusion",
          "Transport of O₂ (oxyhaemoglobin dissociation curve)",
          "Transport of CO₂ (carbaminohaemoglobin, bicarbonate)",
          "Regulation of respiration: neural control",
          "Disorders: asthma, emphysema, occupational respiratory diseases"
        ]
      },
      {
        "id": "zoo-body-fluids-and-circulation",
        "name": "Body Fluids and Circulation",
        "topics": [
          "Blood: composition, plasma, formed elements",
          "Blood groups: ABO, Rh factor",
          "Coagulation of blood",
          "Lymph: composition and functions",
          "Human circulatory system: heart structure",
          "Cardiac cycle, cardiac output, double circulation",
          "Regulation of cardiac activity",
          "Disorders: hypertension, coronary artery disease, angina, heart failure"
        ]
      },
      {
        "id": "zoo-excretory-products-and-their-elimination",
        "name": "Excretory Products and Their Elimination",
        "topics": [
          "Modes of excretion: ammonotelism, ureotelism, uricotelism",
          "Human excretory system: kidney structure, nephron",
          "Urine formation: ultrafiltration, selective reabsorption, tubular secretion",
          "Mechanism of concentration of filtrate",
          "Regulation of kidney function: ADH, renin-angiotensin system",
          "Micturition, role of other organs in excretion",
          "Disorders: renal failure, kidney stones, renal transplant, dialysis"
        ]
      },
      {
        "id": "zoo-locomotion-and-movement",
        "name": "Locomotion and Movement",
        "topics": [
          "Types of movement: amoeboid, ciliary, muscular",
          "Skeletal muscle: structure, sarcomere, actin and myosin",
          "Muscle contraction: sliding filament theory",
          "Skeletal system: axial and appendicular",
          "Joints: types and their functions",
          "Disorders: myasthenia gravis, muscular dystrophy, tetany",
          "Arthritis, osteoporosis, gout"
        ]
      },
      {
        "id": "zoo-neural-control-and-coordination",
        "name": "Neural Control and Coordination",
        "topics": [
          "Neuron: structure, types",
          "Resting and action potential, impulse conduction",
          "Transmission across synapse: synaptic knob, neurotransmitters",
          "Central nervous system: brain (forebrain, midbrain, hindbrain)",
          "Spinal cord: structure",
          "Reflex arc and reflex action",
          "Sensory organs: eye (structure, image formation, defects)",
          "Ear (structure, mechanism of hearing, equilibrium)"
        ]
      },
      {
        "id": "zoo-chemical-coordination-and-integration",
        "name": "Chemical Coordination and Integration",
        "topics": [
          "Endocrine glands and hormones",
          "Hypothalamus: releasing and inhibiting hormones",
          "Pituitary gland: GH, TSH, ACTH, LH, FSH, prolactin, ADH, oxytocin",
          "Thyroid gland: T₃, T₄, calcitonin",
          "Parathyroid: PTH",
          "Adrenal gland: glucocorticoids, mineralocorticoids, epinephrine, norepinephrine",
          "Pancreas: insulin and glucagon",
          "Gonads: androgens and estrogens",
          "Thymus, pineal body, atrial natriuretic factor",
          "Hormonal action: mechanisms (second messengers)"
        ]
      },
      {
        "id": "zoo-reproduction-in-organisms",
        "name": "Reproduction in Organisms",
        "topics": [
          "Modes of reproduction: asexual and sexual",
          "Asexual reproduction: binary fission, budding, fragmentation, regeneration",
          "Sexual reproduction: events, gametes, fertilization",
          "External and internal fertilization",
          "Life spans of organisms"
        ]
      },
      {
        "id": "zoo-human-reproduction",
        "name": "Human Reproduction",
        "topics": [
          "Male reproductive system: testes, accessory glands, ducts",
          "Spermatogenesis: stages, sperm structure",
          "Female reproductive system: ovaries, accessory ducts, uterus",
          "Oogenesis: stages, ovum structure",
          "Menstrual cycle: follicular, ovulatory, luteal phases",
          "Fertilization and implantation",
          "Placenta: formation and functions",
          "Embryonic development: morula, blastula, gastrulation",
          "Organogenesis: brief account",
          "Parturition and lactation"
        ]
      },
      {
        "id": "zoo-reproductive-health",
        "name": "Reproductive Health",
        "topics": [
          "Reproductive health: importance, problems, strategies",
          "Population stabilisation: need and measures",
          "Contraception methods: natural, barrier, IUDs, oral pills, surgical",
          "Medical termination of pregnancy (MTP): legality and need",
          "Sexually transmitted diseases (STDs): types, prevention",
          "Infertility: causes, assisted reproductive technologies (ART)",
          "IVF, ET, ZIFT, GIFT, AI — overview"
        ]
      },
      {
        "id": "zoo-evolution",
        "name": "Evolution",
        "topics": [
          "Origin of life: Miller-Urey experiment, chemical evolution",
          "Theories of evolution: Lamarckism, Darwinism, Neo-Darwinism",
          "Evidence for evolution: fossil record, comparative anatomy",
          "Homology and analogy, molecular evidence",
          "Mechanism of evolution: mutation, genetic drift, gene flow, natural selection",
          "Hardy-Weinberg principle",
          "Types of natural selection",
          "Speciation: allopatric, sympatric",
          "Brief account of human evolution"
        ]
      },
      {
        "id": "zoo-human-health-and-disease",
        "name": "Human Health and Disease",
        "topics": [
          "Common diseases: typhoid, pneumonia, common cold, malaria, amoebiasis",
          "Ascariasis, ringworm",
          "Immunity: innate and acquired immunity",
          "Active and passive immunity",
          "Lymphoid organs: thymus, spleen, lymph nodes",
          "Vaccines and vaccination",
          "Autoimmunity",
          "HIV-AIDS: life cycle, transmission, diagnosis, prevention",
          "Cancer: types, causes, diagnosis, treatment",
          "Drugs and alcohol abuse: types, effects, treatment",
          "Adolescence and drug abuse"
        ]
      }
    ]
  }
];

export const JEE_SYLLABUS: SubjectData[] = [
  {
    "name": "Physics",
    "chapters": [
      {
        "id": "physics-physical-world-and-measurement",
        "name": "Physical World and Measurement",
        "topics": [
          "Units of measurements, System of Units, SI Units",
          "Fundamental and derived units",
          "Least count, significant figures",
          "Errors in measurements",
          "Dimensions of physical quantities, dimensional analysis and its applications"
        ]
      },
      {
        "id": "physics-kinematics",
        "name": "Kinematics",
        "topics": [
          "Frame of reference, motion in a straight line",
          "Position-time graph, speed and velocity",
          "Uniform and non-uniform motion, average speed",
          "Uniformly accelerated motion, velocity-time graphs",
          "Scalars and Vectors — addition, subtraction, products",
          "Unit vector, resolution of a vector, relative velocity",
          "Motion in a plane, Projectile motion",
          "Uniform circular motion"
        ]
      },
      {
        "id": "physics-laws-of-motion",
        "name": "Laws of Motion",
        "topics": [
          "Force and inertia, Newton's First law",
          "Momentum, Newton's Second law, impulse",
          "Newton's Third law, conservation of linear momentum",
          "Equilibrium of concurrent forces",
          "Static and kinetic friction, laws of friction, rolling friction",
          "Dynamics of uniform circular motion: centripetal force",
          "Vehicle on level road and banked road"
        ]
      },
      {
        "id": "physics-work-energy-and-power",
        "name": "Work, Energy and Power",
        "topics": [
          "Work done by constant force and variable force",
          "Kinetic and potential energies, work-energy theorem, power",
          "Potential energy of spring, conservation of mechanical energy",
          "Conservative and non-conservative forces",
          "Elastic and inelastic collisions in 1D and 2D",
          "Motion in a vertical circle"
        ]
      },
      {
        "id": "physics-rotational-motion",
        "name": "Rotational Motion",
        "topics": [
          "Centre of mass of two-particle system and rigid body",
          "Basic concepts of rotational motion",
          "Moment of force, torque, angular momentum",
          "Conservation of angular momentum",
          "Moment of inertia, radius of gyration",
          "Values of MI for simple objects",
          "Parallel and perpendicular axes theorems",
          "Equilibrium of rigid bodies, equations of rotational motion"
        ]
      },
      {
        "id": "physics-gravitation",
        "name": "Gravitation",
        "topics": [
          "Universal law of gravitation",
          "Acceleration due to gravity — variation with altitude and depth",
          "Kepler's laws of planetary motion",
          "Gravitational potential energy and gravitational potential",
          "Escape velocity",
          "Motion of a satellite: orbital velocity, time period, energy"
        ]
      },
      {
        "id": "physics-properties-of-solids-and-liquids",
        "name": "Properties of Solids and Liquids",
        "topics": [
          "Elastic behaviour, stress-strain, Hooke's law",
          "Young's modulus, bulk modulus, modulus of rigidity",
          "Pressure due to fluid column, Pascal's law",
          "Viscosity, Stokes' law, terminal velocity",
          "Bernoulli's principle and its applications",
          "Surface tension, angle of contact, capillary rise",
          "Heat, temperature, thermal expansion",
          "Specific heat capacity, calorimetry, latent heat",
          "Heat transfer — conduction, convection, radiation"
        ]
      },
      {
        "id": "physics-thermodynamics",
        "name": "Thermodynamics",
        "topics": [
          "Thermal equilibrium, zeroth law, concept of temperature",
          "Heat, work, internal energy",
          "First law of thermodynamics, isothermal and adiabatic processes",
          "Second law of thermodynamics",
          "Reversible and irreversible processes"
        ]
      },
      {
        "id": "physics-kinetic-theory-of-gases",
        "name": "Kinetic Theory of Gases",
        "topics": [
          "Equation of state of a perfect gas",
          "Kinetic theory — assumptions, concept of pressure",
          "Kinetic interpretation of temperature, RMS speed",
          "Degrees of freedom, law of equipartition of energy",
          "Applications to specific heat capacities of gases",
          "Mean free path, Avogadro's number"
        ]
      },
      {
        "id": "physics-oscillations-and-waves",
        "name": "Oscillations and Waves",
        "topics": [
          "Oscillations: time period, frequency, displacement",
          "Simple harmonic motion (SHM) and its equation",
          "Oscillations of a spring, energy in SHM",
          "Simple pendulum — expression for time period",
          "Wave motion: longitudinal and transverse waves",
          "Speed of travelling wave, superposition principle",
          "Reflection of waves, standing waves",
          "Strings and organ pipes, fundamental mode, harmonics",
          "Beats"
        ]
      },
      {
        "id": "physics-electrostatics",
        "name": "Electrostatics",
        "topics": [
          "Electric charges, conservation of charge, Coulomb's law",
          "Superposition principle, continuous charge distribution",
          "Electric field, field lines, electric dipole",
          "Torque on dipole in uniform electric field",
          "Electric flux, Gauss's law and its applications",
          "Electric potential: point charge, dipole, system of charges",
          "Equipotential surfaces, electrical potential energy",
          "Conductors and insulators, dielectrics, polarization",
          "Capacitors — series and parallel combinations",
          "Parallel plate capacitor, energy stored in capacitor"
        ]
      },
      {
        "id": "physics-current-electricity",
        "name": "Current Electricity",
        "topics": [
          "Electric current, drift velocity, mobility",
          "Ohm's law, electrical resistance",
          "V-I characteristics of ohmic and non-ohmic conductors",
          "Electrical energy and power, resistivity and conductivity",
          "Series and parallel combinations, temperature dependence",
          "Internal resistance, EMF of cell, cells in series and parallel",
          "Kirchhoff's laws, Wheatstone bridge, Metre bridge"
        ]
      },
      {
        "id": "physics-magnetic-effects-of-current-and-magnetism",
        "name": "Magnetic Effects of Current and Magnetism",
        "topics": [
          "Biot-Savart law, circular loop",
          "Ampere's law — long wire and solenoid",
          "Force on moving charge in electric and magnetic fields",
          "Force on current-carrying conductor in magnetic field",
          "Force between two parallel currents, definition of ampere",
          "Torque on current loop, moving coil galvanometer",
          "Conversion to ammeter and voltmeter",
          "Current loop as magnetic dipole",
          "Bar magnet — equivalent solenoid, magnetic field lines",
          "Para-, dia-, and ferromagnetic substances",
          "Effect of temperature on magnetic properties"
        ]
      },
      {
        "id": "physics-electromagnetic-induction-and-ac",
        "name": "Electromagnetic Induction and AC",
        "topics": [
          "Electromagnetic induction, Faraday's law",
          "Induced EMF and current, Lenz's law, eddy currents",
          "Self and mutual inductance",
          "Alternating currents, peak and RMS values",
          "Reactance and impedance",
          "LCR series circuit, resonance",
          "Power in AC circuits, wattless current",
          "AC generator and transformer"
        ]
      },
      {
        "id": "physics-electromagnetic-waves",
        "name": "Electromagnetic Waves",
        "topics": [
          "Displacement current",
          "Electromagnetic waves and their characteristics",
          "Transverse nature of EM waves",
          "EM spectrum: radio, microwave, infrared, visible, UV, X-ray, gamma",
          "Applications of EM waves"
        ]
      },
      {
        "id": "physics-optics",
        "name": "Optics",
        "topics": [
          "Reflection of light, spherical mirrors, mirror formula",
          "Refraction at plane and spherical surfaces, thin lens formula",
          "Lens maker's formula, total internal reflection",
          "Magnification, power of lens, combination of lenses",
          "Refraction through prism",
          "Microscope and astronomical telescope",
          "Wave optics: wavefront, Huygens' principle",
          "Interference, Young's double slit experiment, fringe width",
          "Diffraction due to single slit",
          "Polarization, Brewster's law, polaroids"
        ]
      },
      {
        "id": "physics-dual-nature-of-matter-and-radiation",
        "name": "Dual Nature of Matter and Radiation",
        "topics": [
          "Dual nature of radiation, photoelectric effect",
          "Hertz and Lenard's observations",
          "Einstein's photoelectric equation, particle nature of light",
          "Matter waves, de Broglie relation"
        ]
      },
      {
        "id": "physics-atoms-and-nuclei",
        "name": "Atoms and Nuclei",
        "topics": [
          "Alpha-particle scattering, Rutherford's model",
          "Bohr model, energy levels, hydrogen spectrum",
          "Composition and size of nucleus, atomic masses",
          "Mass-energy relation, mass defect",
          "Binding energy per nucleon",
          "Nuclear fission and fusion"
        ]
      },
      {
        "id": "physics-electronic-devices",
        "name": "Electronic Devices",
        "topics": [
          "Semiconductors, semiconductor diode",
          "I-V characteristics: forward and reverse bias",
          "Diode as rectifier",
          "LED, photodiode, solar cell, Zener diode",
          "Zener diode as voltage regulator",
          "Logic gates: OR, AND, NOT, NAND, NOR"
        ]
      },
      {
        "id": "physics-experimental-skills",
        "name": "Experimental Skills",
        "topics": [
          "Vernier callipers — internal/external diameter, depth",
          "Screw gauge — thickness/diameter of sheet/wire",
          "Simple pendulum — energy dissipation",
          "Metre scale — principle of moments",
          "Young's modulus of metallic wire",
          "Surface tension — capillary rise, effect of detergents",
          "Coefficient of viscosity — terminal velocity",
          "Speed of sound in air — resonance tube",
          "Specific heat capacity — method of mixtures",
          "Resistivity — metre bridge, Ohm's law",
          "Galvanometer — half deflection method",
          "Focal length of concave/convex mirror, convex lens",
          "Angle of deviation vs angle of incidence — prism",
          "Refractive index of glass slab",
          "p-n junction diode — forward/reverse bias curves",
          "Zener diode characteristics",
          "Identification of diode, LED, transistor, IC, resistor, capacitor"
        ]
      }
    ]
  },
  {
    "name": "Chemistry",
    "chapters": [
      {
        "id": "chem-some-basic-concepts-of-chemistry",
        "name": "Some Basic Concepts of Chemistry",
        "topics": [
          "Matter and its nature, Dalton's atomic theory",
          "Concept of atom, molecule, element, compound",
          "Laws of chemical combination",
          "Atomic and molecular masses, mole concept, molar mass",
          "Percentage composition, empirical and molecular formulae",
          "Chemical equations and stoichiometry"
        ]
      },
      {
        "id": "chem-structure-of-atom",
        "name": "Structure of Atom",
        "topics": [
          "Nature of electromagnetic radiation, photoelectric effect",
          "Spectrum of hydrogen atom",
          "Bohr model — postulates, energy of electron, radii of orbits, limitations",
          "Dual nature of matter, de Broglie's relationship",
          "Heisenberg uncertainty principle",
          "Quantum mechanical model of atom",
          "Atomic orbitals — variation of ψ and ψ² with r",
          "Quantum numbers (principal, angular, magnetic)",
          "Shapes of s, p, d orbitals",
          "Electron spin and spin quantum number",
          "Aufbau principle, Pauli's exclusion principle, Hund's rule",
          "Electronic configuration, extra stability of half-filled/filled orbitals"
        ]
      },
      {
        "id": "chem-chemical-bonding-and-molecular-structure",
        "name": "Chemical Bonding and Molecular Structure",
        "topics": [
          "Kossel–Lewis approach to chemical bonding",
          "Ionic bonding: formation, factors, lattice enthalpy",
          "Covalent bonding: electronegativity, Fajan's rule, dipole moment",
          "VSEPR theory and shapes of molecules",
          "Valence bond theory: hybridization (s, p, d orbitals), resonance",
          "Molecular orbital theory: LCAOs, bonding/antibonding MOs",
          "Sigma and pi bonds, MO electronic configurations",
          "Bond order, bond length, bond energy",
          "Metallic bonding, hydrogen bonding and applications"
        ]
      },
      {
        "id": "chem-chemical-thermodynamics",
        "name": "Chemical Thermodynamics",
        "topics": [
          "System and surroundings, extensive/intensive properties, state functions",
          "Types of processes",
          "First law: work, heat, internal energy, enthalpy, heat capacity",
          "Hess's law of constant heat summation",
          "Enthalpies of bond dissociation, combustion, formation, atomization",
          "Sublimation, phase transition, hydration, ionization, solution",
          "Second law: spontaneity, ΔS of universe, ΔG of system",
          "Standard Gibbs energy change and equilibrium constant"
        ]
      },
      {
        "id": "chem-solutions",
        "name": "Solutions",
        "topics": [
          "Methods for expressing concentration: molality, molarity, mole fraction, %",
          "Vapour pressure of solutions, Raoult's law",
          "Ideal and non-ideal solutions, vapour pressure–composition plots",
          "Colligative properties: lowering of vapour pressure",
          "Depression of freezing point, elevation of boiling point",
          "Osmotic pressure",
          "Determination of molecular mass from colligative properties",
          "Abnormal molar mass, van't Hoff factor"
        ]
      },
      {
        "id": "chem-equilibrium",
        "name": "Equilibrium",
        "topics": [
          "Concept of dynamic equilibrium",
          "Physical equilibria: solid-liquid, liquid-gas, solid-gas",
          "Henry's law",
          "Chemical equilibrium: law of equilibrium, Kp and Kc",
          "ΔG and ΔG° in chemical equilibrium",
          "Factors affecting equilibrium: Le Chatelier's principle",
          "Ionic equilibrium: weak/strong electrolytes",
          "Bronsted-Lowry and Lewis acid-base concepts",
          "Acid-base equilibria, ionization constants",
          "pH scale, common ion effect",
          "Hydrolysis of salts, solubility product, buffer solutions"
        ]
      },
      {
        "id": "chem-redox-reactions-and-electrochemistry",
        "name": "Redox Reactions and Electrochemistry",
        "topics": [
          "Electronic concepts of oxidation and reduction",
          "Oxidation number, rules for assigning, balancing redox reactions",
          "Electrolytic and metallic conduction",
          "Molar conductivities, Kohlrausch's law",
          "Electrochemical cells: electrolytic and galvanic",
          "Electrode potentials, standard electrode potential",
          "Half-cell and cell reactions, EMF and its measurement",
          "Nernst equation and applications",
          "Relationship between cell potential and Gibbs energy",
          "Dry cell, lead accumulator, fuel cells"
        ]
      },
      {
        "id": "chem-chemical-kinetics",
        "name": "Chemical Kinetics",
        "topics": [
          "Rate of reaction, factors affecting rate",
          "Elementary and complex reactions",
          "Order and molecularity of reactions, rate law",
          "Rate constant and its units",
          "Zero and first-order reactions: differential and integral forms",
          "Half-lives of reactions",
          "Effect of temperature on rate, Arrhenius theory",
          "Activation energy and its calculation",
          "Collision theory of bimolecular gaseous reactions"
        ]
      },
      {
        "id": "chem-classification-of-elements-and-periodicity",
        "name": "Classification of Elements and Periodicity",
        "topics": [
          "Modern periodic law, present form of periodic table",
          "s, p, d and f block elements",
          "Periodic trends: atomic/ionic radii, ionization enthalpy",
          "Electron gain enthalpy, valence, oxidation states",
          "Chemical reactivity"
        ]
      },
      {
        "id": "chem-p-block-elements",
        "name": "p-Block Elements",
        "topics": [
          "Groups 13–18 elements",
          "Electronic configuration and general trends",
          "Physical and chemical properties across periods and down groups",
          "Unique behaviour of first element in each group"
        ]
      },
      {
        "id": "chem-d-and-f-block-elements",
        "name": "d- and f-Block Elements",
        "topics": [
          "Transition elements: general introduction, electronic configuration",
          "General trends: physical properties, ionization enthalpy, oxidation states",
          "Atomic radii, colour, catalytic behaviour, magnetic properties",
          "Complex formation, interstitial compounds, alloy formation",
          "Preparation, properties and uses of K₂Cr₂O₇ and KMnO₄",
          "Lanthanoids: electronic configuration, oxidation states, lanthanoid contraction",
          "Actinoids: electronic configuration and oxidation states"
        ]
      },
      {
        "id": "chem-coordination-compounds",
        "name": "Coordination Compounds",
        "topics": [
          "Introduction, Werner's theory",
          "Ligands, coordination number, denticity, chelation",
          "IUPAC nomenclature of mononuclear coordination compounds",
          "Isomerism in coordination compounds",
          "Valence bond approach, crystal field theory (basics)",
          "Colour and magnetic properties",
          "Importance in qualitative analysis, extraction of metals, biological systems"
        ]
      },
      {
        "id": "chem-purification-and-characterisation-of-organic-compounds",
        "name": "Purification and Characterisation of Organic Compounds",
        "topics": [
          "Purification methods: crystallization, sublimation, distillation",
          "Differential extraction, chromatography — principles and applications",
          "Qualitative analysis: detection of N, S, P, halogens",
          "Quantitative analysis: estimation of C, H, N, halogens, S, P",
          "Calculation of empirical and molecular formulae"
        ]
      },
      {
        "id": "chem-basic-principles-of-organic-chemistry",
        "name": "Basic Principles of Organic Chemistry",
        "topics": [
          "Tetravalency of carbon, hybridization (s and p)",
          "Classification of organic compounds by functional groups",
          "Homologous series, structural and stereoisomerism",
          "Nomenclature: trivial and IUPAC",
          "Covalent bond fission: homolytic, heterolytic",
          "Free radicals, carbocations, carbanions",
          "Stability of carbocations, electrophiles and nucleophiles",
          "Electronic displacement: inductive, electromeric, resonance, hyperconjugation",
          "Substitution, addition, elimination, rearrangement reactions"
        ]
      },
      {
        "id": "chem-hydrocarbons",
        "name": "Hydrocarbons",
        "topics": [
          "Classification, isomerism, IUPAC nomenclature",
          "Alkanes: conformations, Sawhorse and Newman projections, halogenation mechanism",
          "Alkenes: geometrical isomerism, electrophilic addition mechanism",
          "Addition of H₂, halogens, water, HX (Markovnikov's rule, peroxide effect)",
          "Ozonolysis, polymerization of alkenes",
          "Alkynes: acidic character, addition reactions, polymerization",
          "Aromatic hydrocarbons: nomenclature, benzene structure, aromaticity",
          "Electrophilic substitution: halogenation, nitration, Friedel–Crafts reactions",
          "Directive influence of functional groups in mono-substituted benzene"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-halogens",
        "name": "Organic Compounds Containing Halogens",
        "topics": [
          "General methods of preparation, properties, reactions",
          "Nature of C–X bond, mechanisms of substitution",
          "Uses and environmental effects of chloroform, iodoform, freons, DDT"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-oxygen",
        "name": "Organic Compounds Containing Oxygen",
        "topics": [
          "Alcohols, phenols, ethers: preparation, properties, reactions",
          "Identification of primary, secondary, tertiary alcohols",
          "Mechanism of dehydration of alcohols",
          "Phenols: acidic nature, electrophilic substitution (halogenation, nitration, sulphonation)",
          "Reimer–Tiemann reaction",
          "Ethers: structure",
          "Aldehydes and ketones: carbonyl group, nucleophilic addition",
          "Addition of HCN, NH₃ and derivatives, Grignard reagent",
          "Oxidation, reduction (Wolff–Kishner and Clemmensen)",
          "Aldol condensation, Cannizzaro reaction, haloform reaction",
          "Chemical tests to distinguish aldehydes and ketones",
          "Carboxylic acids: acidic strength and factors affecting it"
        ]
      },
      {
        "id": "chem-organic-compounds-containing-nitrogen",
        "name": "Organic Compounds Containing Nitrogen",
        "topics": [
          "Amines: nomenclature, classification, structure, basic character",
          "Identification of primary, secondary, tertiary amines",
          "Diazonium salts: importance in synthetic organic chemistry"
        ]
      },
      {
        "id": "chem-biomolecules",
        "name": "Biomolecules",
        "topics": [
          "Carbohydrates: classification, aldoses and ketoses",
          "Monosaccharides: glucose and fructose",
          "Oligosaccharides: sucrose, lactose, maltose",
          "Proteins: α-amino acids, peptide bond, polypeptides",
          "Primary, secondary, tertiary, quaternary structure of proteins",
          "Denaturation of proteins, enzymes",
          "Vitamins: classification and functions",
          "Nucleic acids: chemical constitution of DNA and RNA",
          "Biological functions of nucleic acids",
          "Hormones: general introduction"
        ]
      },
      {
        "id": "chem-principles-related-to-practical-chemistry",
        "name": "Principles Related to Practical Chemistry",
        "topics": [
          "Detection of extra elements (N, S, halogens) in organic compounds",
          "Detection of functional groups: hydroxyl, carbonyl, carboxyl, amino",
          "Preparation of Mohr's salt, potash alum",
          "Preparation of acetanilide, p-nitroacetanilide, aniline yellow, iodoform",
          "Titrimetric exercises: acids, bases, indicators",
          "Oxalic acid vs KMnO₄, Mohr's salt vs KMnO₄",
          "Qualitative salt analysis: principles of cation and anion identification"
        ]
      }
    ]
  },
  {
    "name": "Mathematics",
    "chapters": [
      {
        "id": "math-sets-relations",
        "name": "Sets, Relations & Functions",
        "topics": [
          "Sets",
          "Relations",
          "Functions"
        ]
      },
      {
        "id": "math-complex-numbers",
        "name": "Complex Numbers & Quadratic Equations",
        "topics": [
          "Complex Numbers",
          "Quadratic Equations"
        ]
      },
      {
        "id": "math-matrices-determinants",
        "name": "Matrices & Determinants",
        "topics": [
          "Matrices",
          "Determinants"
        ]
      },
      {
        "id": "math-permutations-combinations",
        "name": "Permutations & Combinations",
        "topics": [
          "Permutations",
          "Combinations"
        ]
      },
      {
        "id": "math-mathematical-induction",
        "name": "Mathematical Induction",
        "topics": [
          "Principle of Mathematical Induction"
        ]
      },
      {
        "id": "math-binomial-theorem",
        "name": "Binomial Theorem",
        "topics": [
          "Binomial Theorem",
          "Simple Applications"
        ]
      },
      {
        "id": "math-sequences-series",
        "name": "Sequences & Series",
        "topics": [
          "Arithmetic Progression",
          "Geometric Progression",
          "Harmonic Progression"
        ]
      },
      {
        "id": "math-limit-continuity",
        "name": "Limit, Continuity & Differentiability",
        "topics": [
          "Limits",
          "Continuity",
          "Differentiability"
        ]
      },
      {
        "id": "math-integral-calculus",
        "name": "Integral Calculus",
        "topics": [
          "Indefinite Integrals",
          "Definite Integrals",
          "Area Under Curves"
        ]
      },
      {
        "id": "math-differential-equations",
        "name": "Differential Equations",
        "topics": [
          "Ordinary Differential Equations",
          "Linear Differential Equations"
        ]
      },
      {
        "id": "math-coordinate-geometry",
        "name": "Coordinate Geometry",
        "topics": [
          "Straight Lines",
          "Circles",
          "Conic Sections"
        ]
      },
      {
        "id": "math-3d-geometry",
        "name": "Three Dimensional Geometry",
        "topics": [
          "Direction Cosines",
          "Lines in Space",
          "Planes"
        ]
      },
      {
        "id": "math-vector-algebra",
        "name": "Vector Algebra",
        "topics": [
          "Vectors",
          "Addition of Vectors",
          "Product of Vectors"
        ]
      },
      {
        "id": "math-statistics-probability",
        "name": "Statistics & Probability",
        "topics": [
          "Measures of Dispersion",
          "Probability"
        ]
      },
      {
        "id": "math-trigonometry",
        "name": "Trigonometry",
        "topics": [
          "Trigonometric Functions",
          "Trigonometric Equations",
          "Inverse Trigonometric Functions",
          "Heights and Distances"
        ]
      },
      {
        "id": "math-mathematical-reasoning",
        "name": "Mathematical Reasoning",
        "topics": [
          "Statements",
          "Logical Operations"
        ]
      }
    ]
  }
];

export function getSyllabus(exam: string): SubjectData[] {
  if (exam === "NEET") return NEET_SYLLABUS
  if (exam === "JEE_MAINS" || exam === "JEE_ADV") return JEE_SYLLABUS
  return NEET_SYLLABUS
}
