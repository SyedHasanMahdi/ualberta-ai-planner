
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── FULL COURSE DATABASE ──────────────────────────────────────────────────
// Sources: apps.ualberta.ca/catalogue + AI Option Honours worksheet
// All relevant CMPUT, MATH, STAT, PHYS, ECE, PHIL, LING courses for BSc CS AI
const ALL_COURSES = [
  // ── HIGH SCHOOL ───────────────────────────────────────────────────────────
  { id:"HS_MATH",   code:"Math 30-1",   name:"High School Math",           dept:"HS",    cat:"Prereq",    year:0, units:0, pre:[], co:[], desc:"Alberta Math 30-1 or equivalent", url:"" },

  // ── MATH ──────────────────────────────────────────────────────────────────
  { id:"MATH100",   code:"MATH 100",    name:"Calculus for Engineering I",  dept:"MATH",  cat:"Math",      year:1, units:3.5, pre:["HS_MATH"], co:[], desc:"Limits, derivatives, integration, Taylor polynomials.", url:"https://apps.ualberta.ca/catalogue/course/math/100" },
  { id:"MATH114",   code:"MATH 114",    name:"Elementary Calculus I",       dept:"MATH",  cat:"Math",      year:1, units:3, pre:["HS_MATH"], co:[], desc:"Differentiation, integration, Fundamental Theorem. Open study.", url:"https://apps.ualberta.ca/catalogue/course/math/114" },
  { id:"MATH117",   code:"MATH 117",    name:"Honors Calculus I",           dept:"MATH",  cat:"Math",      year:1, units:3, pre:["HS_MATH"], co:[], desc:"Honors track. Requires 80%+ in Math 30-1 and Math 31.", url:"https://apps.ualberta.ca/catalogue/course/math/117" },
  { id:"MATH134",   code:"MATH 134",    name:"Calculus for Life Sciences I",dept:"MATH",  cat:"Math",      year:1, units:3, pre:["HS_MATH"], co:[], desc:"Calculus in a life sciences context.", url:"https://apps.ualberta.ca/catalogue/course/math/134" },
  { id:"MATH101",   code:"MATH 101",    name:"Calculus for Engineering II", dept:"MATH",  cat:"Math",      year:1, units:3.5, pre:["MATH100"], co:[], desc:"Integration techniques, series, polar coordinates.", url:"https://apps.ualberta.ca/catalogue/course/math/101" },
  { id:"MATH115",   code:"MATH 115",    name:"Elementary Calculus II",      dept:"MATH",  cat:"Math",      year:1, units:3, pre:["MATH114"], co:[], desc:"Integration, differential equations. Open study.", url:"https://apps.ualberta.ca/catalogue/course/math/115" },
  { id:"MATH118",   code:"MATH 118",    name:"Honors Calculus II",          dept:"MATH",  cat:"Math",      year:1, units:3, pre:["MATH117"], co:[], desc:"Integration, series, partial derivatives. Honors track.", url:"https://apps.ualberta.ca/catalogue/course/math/118" },
  { id:"MATH102",   code:"MATH 102",    name:"Applied Linear Algebra",      dept:"MATH",  cat:"Math",      year:1, units:3.5, pre:[], co:["MATH100"], desc:"Vectors, matrices, eigenvalues. Engineering students. Prereq or coreq: MATH 100.", url:"https://apps.ualberta.ca/catalogue/course/math/102" },
  { id:"MATH125",   code:"MATH 125",    name:"Linear Algebra I",            dept:"MATH",  cat:"Math",      year:1, units:3, pre:["HS_MATH"], co:[], desc:"Systems of equations, matrix algebra, eigenvalues. Open study.", url:"https://apps.ualberta.ca/catalogue/course/math/125" },
  { id:"MATH127",   code:"MATH 127",    name:"Honors Linear Algebra I",     dept:"MATH",  cat:"Math",      year:1, units:3, pre:["HS_MATH"], co:[], desc:"Linear equations, vector spaces, determinants. Honors.", url:"https://apps.ualberta.ca/catalogue/course/math/127" },
  { id:"MATH214",   code:"MATH 214",    name:"Calculus III",                dept:"MATH",  cat:"Math",      year:2, units:3, pre:["MATH115"], co:[], desc:"Series, Taylor series, partial differentiation, multiple integration.", url:"https://apps.ualberta.ca/catalogue/course/math/214" },
  { id:"MATH225",   code:"MATH 225",    name:"Linear Algebra II",           dept:"MATH",  cat:"Math",      year:2, units:3, pre:["MATH114","MATH125"], co:[], desc:"Vector spaces, linear transformations, orthogonal diagonalization.", url:"https://apps.ualberta.ca/catalogue/course/math/225" },
  { id:"MATH227",   code:"MATH 227",    name:"Honors Linear Algebra II",    dept:"MATH",  cat:"Math",      year:2, units:3, pre:["MATH127"], co:[], desc:"Canonical forms, inner product spaces, SVD. Honors track.", url:"https://apps.ualberta.ca/catalogue/course/math/227" },
  { id:"MATH228",   code:"MATH 228",    name:"Algebra: Ring Theory",        dept:"MATH",  cat:"Math",      year:2, units:3, pre:["MATH125"], co:[], desc:"Commutative rings, fields, finite fields, polynomial codes.", url:"https://apps.ualberta.ca/catalogue/course/math/228" },
  { id:"MATH315",   code:"MATH 315",    name:"Calculus IV",                 dept:"MATH",  cat:"Math",      year:3, units:3, pre:["MATH214","MATH125"], co:[], desc:"Vector calculus, line and surface integrals, Stokes' theorem.", url:"https://apps.ualberta.ca/catalogue/course/math/315" },
  { id:"MATH334",   code:"MATH 334",    name:"Intro to Differential Eq.",   dept:"MATH",  cat:"Math",      year:2, units:3, pre:["MATH214"], co:[], desc:"First- and second-order ODEs, Laplace transforms, systems.", url:"https://apps.ualberta.ca/catalogue/course/math/334" },

  // ── STAT ──────────────────────────────────────────────────────────────────
  { id:"STAT151",   code:"STAT 151",    name:"Applied Statistics I",        dept:"STAT",  cat:"Stats",     year:1, units:3, pre:["HS_MATH"], co:[], desc:"Descriptive stats, probability, hypothesis testing, regression.", url:"https://apps.ualberta.ca/catalogue/course/stat/151" },
  { id:"STAT161",   code:"STAT 161",    name:"Statistics for Business/Econ",dept:"STAT",  cat:"Stats",     year:1, units:3, pre:["HS_MATH"], co:[], desc:"Stats methods for business and economics.", url:"https://apps.ualberta.ca/catalogue/course/stat/161" },
  { id:"STAT181",   code:"STAT 181",    name:"Combinatorics and Probability",dept:"STAT", cat:"Stats",     year:1, units:3, pre:["MATH125"], co:["MATH115"], desc:"Counting, conditional probability, MGFs, strong LLN.", url:"https://apps.ualberta.ca/catalogue/course/stat/181" },
  { id:"STAT235",   code:"STAT 235",    name:"Statistics for Engineering",  dept:"STAT",  cat:"Stats",     year:1, units:3, pre:["MATH100"], co:["MATH101"], desc:"Applied probability and statistics for engineers.", url:"https://apps.ualberta.ca/catalogue/course/stat/235" },
  { id:"STAT252",   code:"STAT 252",    name:"Applied Statistics II",       dept:"STAT",  cat:"Stats",     year:2, units:3, pre:["STAT151"], co:[], desc:"Regression, ANOVA, data analysis methods.", url:"https://apps.ualberta.ca/catalogue/course/stat/252" },
  { id:"STAT265",   code:"STAT 265",    name:"Probability & Statistics I",  dept:"STAT",  cat:"Stats",     year:1, units:3, pre:[], co:["MATH214"], desc:"Sample spaces, random variables, distributions, multivariate.", url:"https://apps.ualberta.ca/catalogue/course/stat/265" },
  { id:"STAT266",   code:"STAT 266",    name:"Probability & Statistics II", dept:"STAT",  cat:"Stats",     year:2, units:3, pre:["MATH214","STAT265"], co:["MATH225"], desc:"Functions of RVs, CLT, statistical inference, MLE, testing.", url:"https://apps.ualberta.ca/catalogue/course/stat/266" },
  { id:"STAT276",   code:"STAT 276",    name:"Statistics for Data Science", dept:"STAT",  cat:"Stats",     year:2, units:3, pre:["STAT265"], co:[], desc:"Statistical learning, inference, regression, CLT for DS.", url:"https://apps.ualberta.ca/catalogue/course/stat/276" },
  { id:"STAT281",   code:"STAT 281",    name:"Probability by Counting/Queuing",dept:"STAT",cat:"Stats",   year:2, units:3, pre:[], co:["MATH214"], desc:"Poisson processes, queues, Markov chains, steady-state.", url:"https://apps.ualberta.ca/catalogue/course/stat/281" },
  { id:"STAT337",   code:"STAT 337",    name:"Biostatistics",               dept:"STAT",  cat:"Stats",     year:3, units:3, pre:["STAT151"], co:[], desc:"ANOVA, multiple regression, logistic regression for biosciences.", url:"https://apps.ualberta.ca/catalogue/course/stat/337" },
  { id:"STAT368",   code:"STAT 368",    name:"Design & Analysis of Exp.",   dept:"STAT",  cat:"Stats",     year:3, units:3, pre:["STAT266"], co:[], desc:"Experimental design, randomization, factorial experiments.", url:"https://apps.ualberta.ca/catalogue/course/stat/368" },

  // ── CMPUT ─────────────────────────────────────────────────────────────────
  { id:"CMPUT174",  code:"CMPUT 174",   name:"Foundations of Computation I",dept:"CMPUT", cat:"CS Core",   year:1, units:3, pre:["HS_MATH"], co:[], desc:"Problem-driven programming; state, control flow, recursion, data structures.", url:"https://apps.ualberta.ca/catalogue/course/cmput/174" },
  { id:"CMPUT175",  code:"CMPUT 175",   name:"Foundations of Computation II",dept:"CMPUT",cat:"CS Core",   year:1, units:3, pre:["CMPUT174"], co:[], desc:"Objects, functional programming, ADTs, sorting algorithms.", url:"https://apps.ualberta.ca/catalogue/course/cmput/175" },
  { id:"CMPUT191",  code:"CMPUT 191",   name:"Introduction to Data Science", dept:"CMPUT",cat:"AI/ML",     year:1, units:3, pre:["HS_MATH"], co:[], desc:"Data acquisition, cleaning, classification, visualization.", url:"https://apps.ualberta.ca/catalogue/course/cmput/191" },
  { id:"CMPUT195",  code:"CMPUT 195",   name:"Principles of Data Science",   dept:"CMPUT",cat:"AI/ML",     year:1, units:3, pre:["CMPUT174"], co:[], desc:"Data manipulation, analysis, visualization, industry tools.", url:"https://apps.ualberta.ca/catalogue/course/cmput/195" },
  { id:"CMPUT200",  code:"CMPUT 200",   name:"Ethics of AI & Data Science",  dept:"CMPUT",cat:"AI/ML",     year:2, units:3, pre:["CMPUT195"], co:[], desc:"Privacy, fairness, bias, explainability in AI systems.", url:"https://apps.ualberta.ca/catalogue/course/cmput/200" },
  { id:"CMPUT201",  code:"CMPUT 201",   name:"Practical Programming Method.",dept:"CMPUT", cat:"CS Core",  year:2, units:3, pre:["CMPUT175"], co:[], desc:"C programming, software engineering principles, Unix tools.", url:"https://apps.ualberta.ca/catalogue/course/cmput/201" },
  { id:"CMPUT204",  code:"CMPUT 204",   name:"Algorithms I",                  dept:"CMPUT",cat:"CS Core",  year:2, units:3, pre:["CMPUT175","CMPUT272","MATH100"], co:[], desc:"Sorting, graph algorithms, dynamic programming, greedy methods.", url:"https://apps.ualberta.ca/catalogue/course/cmput/204" },
  { id:"CMPUT206",  code:"CMPUT 206",   name:"Digital Image Processing",      dept:"CMPUT",cat:"AI/ML",    year:2, units:3, pre:["CMPUT174","MATH100","STAT151"], co:[], desc:"Image processing theory and algorithms with Python.", url:"https://apps.ualberta.ca/catalogue/course/cmput/206" },
  { id:"CMPUT229",  code:"CMPUT 229",   name:"Computer Org. & Architecture",  dept:"CMPUT",cat:"CS Core",  year:2, units:3, pre:["CMPUT201"], co:[], desc:"Assembly, pipelining, memory hierarchy, virtual memory.", url:"https://apps.ualberta.ca/catalogue/course/cmput/229" },
  { id:"CMPUT250",  code:"CMPUT 250",   name:"Computers and Games",           dept:"CMPUT",cat:"Elective", year:2, units:3, pre:[], co:[], desc:"Interdisciplinary game design course. Requires application.", url:"https://apps.ualberta.ca/catalogue/course/cmput/250" },
  { id:"CMPUT256",  code:"CMPUT 256",   name:"Game Artificial Intelligence",  dept:"CMPUT",cat:"AI/ML",    year:1, units:3, pre:["CMPUT174"], co:[], desc:"AI for games: pathfinding, decision-making, data science.", url:"https://apps.ualberta.ca/catalogue/course/cmput/256" },
  { id:"CMPUT261",  code:"CMPUT 261",   name:"Introduction to AI",            dept:"CMPUT",cat:"AI/ML",    year:2, units:3, pre:["STAT151"], co:["CMPUT204"], desc:"Search, knowledge representation, uncertainty, ML, neural nets.", url:"https://apps.ualberta.ca/catalogue/course/cmput/261" },
  { id:"CMPUT267",  code:"CMPUT 267",   name:"Machine Learning I",            dept:"CMPUT",cat:"AI/ML",    year:2, units:3, pre:["CMPUT174","MATH100"], co:["CMPUT175","CMPUT272","MATH102","STAT265"], desc:"Statistical foundations of ML: models, estimation, generalization.", url:"https://apps.ualberta.ca/catalogue/course/cmput/267" },
  { id:"CMPUT272",  code:"CMPUT 272",   name:"Formal Systems & Logic",        dept:"CMPUT",cat:"CS Core",  year:1, units:3, pre:["CMPUT174"], co:[], desc:"Set theory, logic, induction, program correctness.", url:"https://apps.ualberta.ca/catalogue/course/cmput/272" },
  { id:"CMPUT274",  code:"CMPUT 274",   name:"Tangible Computing I (Acc.)",   dept:"CMPUT",cat:"CS Core",  year:1, units:3, pre:["HS_MATH"], co:[], desc:"Accelerated Python intro; studio-style. Alt to CMPUT 174.", url:"https://apps.ualberta.ca/catalogue/course/cmput/274" },
  { id:"CMPUT275",  code:"CMPUT 275",   name:"Tangible Computing II (Acc.)",  dept:"CMPUT",cat:"CS Core",  year:1, units:3, pre:["CMPUT274"], co:[], desc:"Accelerated C++, OOP, graphs. Alt to CMPUT 175+201.", url:"https://apps.ualberta.ca/catalogue/course/cmput/275" },
  { id:"CMPUT291",  code:"CMPUT 291",   name:"File & Database Management",    dept:"CMPUT",cat:"CS Core",  year:2, units:3, pre:["CMPUT175","CMPUT272"], co:["CMPUT201"], desc:"Relational model, SQL, storage architecture, query languages.", url:"https://apps.ualberta.ca/catalogue/course/cmput/291" },
  { id:"CMPUT300",  code:"CMPUT 300",   name:"Computers & Society",           dept:"CMPUT",cat:"Elective", year:2, units:3, pre:["CMPUT174"], co:[], desc:"Social, ethical, professional, legal issues in CS.", url:"https://apps.ualberta.ca/catalogue/course/cmput/300" },
  { id:"CMPUT301",  code:"CMPUT 301",   name:"Software Engineering",          dept:"CMPUT",cat:"CS Core",  year:2, units:3, pre:["CMPUT201"], co:[], desc:"OO design, UML, revision control, software process.", url:"https://apps.ualberta.ca/catalogue/course/cmput/301" },
  { id:"CMPUT302",  code:"CMPUT 302",   name:"Human-Computer Interaction",    dept:"CMPUT",cat:"Elective", year:3, units:3, pre:["CMPUT301"], co:[], desc:"User-centered design, usability evaluation, HCI methods.", url:"https://apps.ualberta.ca/catalogue/course/cmput/302" },
  { id:"CMPUT304",  code:"CMPUT 304",   name:"Algorithms II",                  dept:"CMPUT",cat:"CS Core", year:3, units:3, pre:["CMPUT204","STAT265"], co:[], desc:"NP-completeness, approximation, randomized algorithms.", url:"https://apps.ualberta.ca/catalogue/course/cmput/304" },
  { id:"CMPUT307",  code:"CMPUT 307",   name:"3D Modeling & Animation",        dept:"CMPUT",cat:"Elective",year:3, units:3, pre:["CMPUT204"], co:[], desc:"3D modeling, rendering, animation algorithms.", url:"https://apps.ualberta.ca/catalogue/course/cmput/307" },
  { id:"CMPUT312",  code:"CMPUT 312",   name:"Robotics & Mechatronics",        dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT204","MATH100"], co:[], desc:"Sensor technologies, motion control, real-time programming.", url:"https://apps.ualberta.ca/catalogue/course/cmput/312" },
  { id:"CMPUT313",  code:"CMPUT 313",   name:"Computer Networks",              dept:"CMPUT",cat:"CS Core", year:3, units:3, pre:["CMPUT201","CMPUT204","CMPUT229"], co:[], desc:"Networking protocols, error control, routing, internet.", url:"https://apps.ualberta.ca/catalogue/course/cmput/313" },
  { id:"CMPUT325",  code:"CMPUT 325",   name:"Non-Procedural Prog. Languages", dept:"CMPUT",cat:"Elective",year:3, units:3, pre:["CMPUT201"], co:[], desc:"Functional, logic, and declarative programming paradigms.", url:"https://apps.ualberta.ca/catalogue/course/cmput/325" },
  { id:"CMPUT328",  code:"CMPUT 328",   name:"Visual Recognition",             dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT204","STAT265"], co:[], desc:"Computer vision: detection, classification, neural networks.", url:"https://apps.ualberta.ca/catalogue/course/cmput/328" },
  { id:"CMPUT331",  code:"CMPUT 331",   name:"Computational Cryptography",     dept:"CMPUT",cat:"Elective",year:3, units:3, pre:["CMPUT201","CMPUT272"], co:[], desc:"Encryption, deciphering, cryptographic protocols.", url:"https://apps.ualberta.ca/catalogue/course/cmput/331" },
  { id:"CMPUT340",  code:"CMPUT 340",   name:"Numerical Methods",              dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT204","MATH102","STAT265"], co:[], desc:"Numerical algorithms for science and engineering.", url:"https://apps.ualberta.ca/catalogue/course/cmput/340" },
  { id:"CMPUT350",  code:"CMPUT 350",   name:"Advanced Games Programming",     dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT204"], co:[], desc:"Game engines, physics, AI for interactive entertainment.", url:"https://apps.ualberta.ca/catalogue/course/cmput/350" },
  { id:"CMPUT355",  code:"CMPUT 355",   name:"Games, Puzzles & Algorithms",    dept:"CMPUT",cat:"Elective",year:3, units:3, pre:["CMPUT204"], co:[], desc:"Combinatorial game theory and puzzle algorithms.", url:"https://apps.ualberta.ca/catalogue/course/cmput/355" },
  { id:"CMPUT361",  code:"CMPUT 361",   name:"Information Retrieval",          dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT201","CMPUT204"], co:[], desc:"Boolean retrieval, ranking, web search, ML for text.", url:"https://apps.ualberta.ca/catalogue/course/cmput/361" },
  { id:"CMPUT365",  code:"CMPUT 365",   name:"Reinforcement Learning",         dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT175","STAT265"], co:[], desc:"Bandits, MDPs, RL algorithms, function approximation.", url:"https://apps.ualberta.ca/catalogue/course/cmput/365" },
  { id:"CMPUT366",  code:"CMPUT 366",   name:"Search & Planning in AI",        dept:"CMPUT",cat:"AI/ML",   year:3, units:3, pre:["CMPUT204","CMPUT272"], co:[], desc:"Search, constraint satisfaction, multi-agent planning.", url:"https://apps.ualberta.ca/catalogue/course/cmput/366" },
  { id:"CMPUT379",  code:"CMPUT 379",   name:"Operating Systems",              dept:"CMPUT",cat:"CS Core", year:3, units:3, pre:["CMPUT201","CMPUT229"], co:[], desc:"Processes, memory, file systems, virtual machines.", url:"https://apps.ualberta.ca/catalogue/course/cmput/379" },
  { id:"CMPUT391",  code:"CMPUT 391",   name:"Database Management Systems",    dept:"CMPUT",cat:"Elective",year:3, units:3, pre:["CMPUT291"], co:[], desc:"Advanced database concepts, query optimization, transactions.", url:"https://apps.ualberta.ca/catalogue/course/cmput/391" },
  { id:"CMPUT401",  code:"CMPUT 401",   name:"Software Process Mgmt",          dept:"CMPUT",cat:"Elective",year:4, units:3, pre:["CMPUT301"], co:[], desc:"Best practices in software project and product management.", url:"https://apps.ualberta.ca/catalogue/course/cmput/401" },
  { id:"CMPUT402",  code:"CMPUT 402",   name:"Software Quality",               dept:"CMPUT",cat:"Elective",year:4, units:3, pre:["CMPUT301"], co:[], desc:"Testing, reviews, continuous integration, quality tools.", url:"https://apps.ualberta.ca/catalogue/course/cmput/402" },
  { id:"CMPUT411",  code:"CMPUT 411",   name:"Robotics (Advanced)",            dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT201","CMPUT204","CMPUT340"], co:["CMPUT340"], desc:"Advanced robotics: sensing, actuating, real-time control.", url:"" },
  { id:"CMPUT412",  code:"CMPUT 412",   name:"Experimental Mobile Robotics",   dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT201","CMPUT204","CMPUT340"], co:[], desc:"Sensor processing, motion control for mobile robots.", url:"https://apps.ualberta.ca/catalogue/course/cmput/412" },
  { id:"CMPUT416",  code:"CMPUT 416",   name:"Program Analysis",               dept:"CMPUT",cat:"Elective",year:4, units:3, pre:["CMPUT379"], co:[], desc:"Intermediate representations, pointer analysis, call graphs.", url:"" },
  { id:"CMPUT429",  code:"CMPUT 429",   name:"Compiler Design",                dept:"CMPUT",cat:"Elective",year:4, units:3, pre:["CMPUT229","CMPUT304"], co:[], desc:"Lexical analysis, parsing, code generation, optimization.", url:"" },
  { id:"CMPUT455",  code:"CMPUT 455",   name:"Search, Knowledge & Simulation", dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT366"], co:[], desc:"Decision-making algorithms, game-tree search, simulation.", url:"https://apps.ualberta.ca/catalogue/course/cmput/455" },
  { id:"CMPUT461",  code:"CMPUT 461",   name:"Natural Language Processing",    dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT201","CMPUT361"], co:[], desc:"NLP methods, language models, statistical NLP with ML.", url:"https://apps.ualberta.ca/catalogue/course/cmput/461" },
  { id:"CMPUT463",  code:"CMPUT 463",   name:"Probabilistic Graphical Models", dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT204","CMPUT267"], co:[], desc:"Bayesian networks, inference, learning in PGMs.", url:"https://apps.ualberta.ca/catalogue/course/cmput/463" },
  { id:"CMPUT466",  code:"CMPUT 466",   name:"Machine Learning (Essentials)",  dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT204","STAT265","MATH125"], co:[], desc:"Single-course ML alt. to 267+467: regression to neural nets.", url:"https://apps.ualberta.ca/catalogue/course/cmput/466" },
  { id:"CMPUT467",  code:"CMPUT 467",   name:"Machine Learning II",            dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT204","CMPUT267"], co:[], desc:"Deep learning, neural networks, generative models, optimization.", url:"https://apps.ualberta.ca/catalogue/course/cmput/467" },
  { id:"CMPUT469",  code:"CMPUT 469",   name:"AI Capstone",                    dept:"CMPUT",cat:"Capstone", year:4, units:3, pre:["CMPUT267","CMPUT365","CMPUT366"], co:[], desc:"Team project applying AI to a real-world task. Required for Hons AI.", url:"https://apps.ualberta.ca/catalogue/course/cmput/469" },
  { id:"CMPUT474",  code:"CMPUT 474",   name:"Explainability in AI",           dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT466"], co:[], desc:"Methods for explainable and interpretable AI systems.", url:"" },
  { id:"CMPUT428",  code:"CMPUT 428",   name:"ML for Computer Vision",         dept:"CMPUT",cat:"AI/ML",   year:4, units:3, pre:["CMPUT328","CMPUT467"], co:[], desc:"Deep learning applied to visual recognition tasks.", url:"" },

  // ── ECE / ENGINEERING ─────────────────────────────────────────────────────
  { id:"ECE212",    code:"ECE 212",     name:"Computer Organization (ECE)",    dept:"ECE",   cat:"CS Core", year:2, units:3, pre:["CMPUT201"], co:[], desc:"ECE equivalent to CMPUT 229. Computer organization and architecture.", url:"https://apps.ualberta.ca/catalogue/course/ece/212" },

  // ── PHIL ──────────────────────────────────────────────────────────────────
  { id:"PHIL120",   code:"PHIL 120",    name:"Intro to Logic",                 dept:"PHIL",  cat:"Liberal", year:1, units:3, pre:[], co:[], desc:"Deductive logic, symbolic logic, argument analysis.", url:"https://apps.ualberta.ca/catalogue/course/phil/120" },
  { id:"PHIL222",   code:"PHIL 222",    name:"Formal Logic",                   dept:"PHIL",  cat:"Liberal", year:2, units:3, pre:["PHIL120"], co:[], desc:"Predicate logic, proofs, soundness and completeness.", url:"" },
  { id:"PHIL366",   code:"PHIL 366",    name:"Philosophy of Mind",             dept:"PHIL",  cat:"Liberal", year:3, units:3, pre:[], co:[], desc:"Consciousness, cognition, AI and mind.", url:"" },
  { id:"PHIL447",   code:"PHIL 447",    name:"Philosophy of AI",               dept:"PHIL",  cat:"Liberal", year:4, units:3, pre:[], co:[], desc:"Ethical and philosophical dimensions of AI.", url:"" },

  // ── LING ──────────────────────────────────────────────────────────────────
  { id:"LING101",   code:"LING 101",    name:"Intro to Linguistics",           dept:"LING",  cat:"Liberal", year:1, units:3, pre:[], co:[], desc:"Phonetics, morphology, syntax, semantics.", url:"https://apps.ualberta.ca/catalogue/course/ling/101" },
  { id:"LING307",   code:"LING 307",    name:"Syntax",                         dept:"LING",  cat:"Liberal", year:3, units:3, pre:["LING101"], co:[], desc:"Syntactic theory, phrase structure, transformations.", url:"" },
  { id:"LING415",   code:"LING 415",    name:"Computational Linguistics",      dept:"LING",  cat:"Liberal", year:4, units:3, pre:["LING101","CMPUT175"], co:[], desc:"NLP from a linguistics perspective; parsing, semantics.", url:"" },

  // ── SCI ───────────────────────────────────────────────────────────────────
  { id:"SCI100",    code:"SCI 100",     name:"Interdisciplinary Science",      dept:"SCI",   cat:"Prereq",  year:1, units:6, pre:["HS_MATH"], co:[], desc:"Intro science course. Can substitute for CMPUT 174/175 in some prereq chains.", url:"https://apps.ualberta.ca/catalogue/course/sci/100" },
];

// ─── DEFAULT INCLUDED IDs (the recommended BSc CS AI Option plan) ──────────
const DEFAULT_INCLUDED = new Set([
  "HS_MATH","MATH100","MATH102","MATH125","MATH115","MATH214","MATH225","MATH334",
  "STAT151","STAT265","STAT266","STAT252",
  "CMPUT174","CMPUT175","CMPUT272","CMPUT201","CMPUT204","CMPUT291","CMPUT267",
  "CMPUT229","CMPUT261","CMPUT301","CMPUT365","CMPUT366","CMPUT379","CMPUT195",
  "CMPUT200","CMPUT328","CMPUT312","CMPUT340","CMPUT350","CMPUT361","CMPUT391",
  "CMPUT467","CMPUT455","CMPUT461","CMPUT463","CMPUT469","CMPUT304","CMPUT313",
]);

// Status colours
const CAT_COLORS = {
  "CS Core":  { fill:"#1a56db", text:"#bfdbfe", border:"#3b82f6" },
  "AI/ML":    { fill:"#065f46", text:"#6ee7b7", border:"#10b981" },
  "Math":     { fill:"#78350f", text:"#fde68a", border:"#f59e0b" },
  "Stats":    { fill:"#5b21b6", text:"#ddd6fe", border:"#8b5cf6" },
  "Capstone": { fill:"#9f1239", text:"#fda4af", border:"#f43f5e" },
  "Elective": { fill:"#374151", text:"#d1d5db", border:"#6b7280" },
  "Liberal":  { fill:"#164e63", text:"#a5f3fc", border:"#22d3ee" },
  "Prereq":   { fill:"#1f2937", text:"#9ca3af", border:"#4b5563" },
};

const DEPT_GROUPS = {
  "CMPUT": "Computing Science",
  "MATH":  "Mathematics",
  "STAT":  "Statistics",
  "ECE":   "Engineering",
  "PHIL":  "Philosophy",
  "LING":  "Linguistics",
  "SCI":   "Science",
  "HS":    "Prerequisites",
};

// ─── LAYOUT engine ────────────────────────────────────────────────────────
function computeLayout(visibleCourses) {
  const byYear = {};
  visibleCourses.forEach(c => {
    if (!byYear[c.year]) byYear[c.year] = [];
    byYear[c.year].push(c);
  });
  const years = Object.keys(byYear).map(Number).sort((a,b)=>a-b);
  const W = 1200, ROW_H = 52, NODE_W = 148, NODE_H = 40;
  const yearXMap = {};
  const step = Math.min(220, (W - 80) / Math.max(years.length, 1));
  years.forEach((y, i) => { yearXMap[y] = 60 + i * step; });
  const positions = {};
  years.forEach(y => {
    const arr = byYear[y];
    const totalH = arr.length * ROW_H;
    const startY = Math.max(60, 500 - totalH / 2);
    arr.forEach((c, i) => {
      positions[c.id] = { x: yearXMap[y], y: startY + i * ROW_H, w: NODE_W, h: NODE_H };
    });
  });
  const maxX = Math.max(...Object.values(positions).map(p => p.x + p.w), 400);
  const maxY = Math.max(...Object.values(positions).map(p => p.y + p.h), 400);
  return { positions, canvasW: maxX + 60, canvasH: maxY + 60, yearXMap };
}

// ─── CANVAS spider web renderer ───────────────────────────────────────────
function SpiderWeb({ courses, included, completed, inProgress, positions, canvasW, canvasH, onNodeClick, selectedId }) {
  const canvasRef = useRef(null);
  const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const getAncestors = useCallback((id, visited = new Set()) => {
    const c = courses.find(x => x.id === id);
    if (!c) return visited;
    c.pre.filter(p => included.has(p)).forEach(p => {
      if (!visited.has(p)) { visited.add(p); getAncestors(p, visited); }
    });
    return visited;
  }, [courses, included]);

  const getDescendants = useCallback((id, visited = new Set()) => {
    courses.filter(c => included.has(c.id) && c.pre.includes(id)).forEach(c => {
      if (!visited.has(c.id)) { visited.add(c.id); getDescendants(c.id, visited); }
    });
    return visited;
  }, [courses, included]);

  const isAvailable = useCallback(id => {
    const c = courses.find(x => x.id === id);
    if (!c) return false;
    return c.pre.filter(p => included.has(p)).every(p => completed.has(p));
  }, [courses, included, completed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + "px";
    canvas.style.height = canvasH + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasW, canvasH);

    const ancestors = selectedId ? getAncestors(selectedId) : new Set();
    const descendants = selectedId ? getDescendants(selectedId) : new Set();
    const visibleCourses = courses.filter(c => included.has(c.id));

    // Year divider lines
    const yearsInView = [...new Set(visibleCourses.map(c => c.year))].sort((a,b)=>a-b);
    const stepX = yearsInView.length > 1
      ? (Math.max(...visibleCourses.map(c => positions[c.id]?.x || 0)) - Math.min(...visibleCourses.map(c => positions[c.id]?.x || 0))) / (yearsInView.length - 1)
      : 200;

    yearsInView.forEach(y => {
      const xVals = visibleCourses.filter(c => c.year === y).map(c => positions[c.id]?.x || 0);
      if (!xVals.length) return;
      const x = xVals[0] + 74;
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, canvasH - 20); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "500 11px 'DM Mono', monospace";
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
      ctx.textAlign = "center";
      ctx.fillText(y === 0 ? "HS" : `Y${y}`, x, 16);
      ctx.restore();
    });

    // Draw edges
    const drawEdge = (fromId, toId, dashed, alpha, color) => {
      const fp = positions[fromId]; const tp = positions[toId];
      if (!fp || !tp) return;
      const x1 = fp.x + fp.w / 2, y1 = fp.y + fp.h / 2;
      const x2 = tp.x + tp.w / 2, y2 = tp.y + tp.h / 2;
      const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx+dy*dy);
      if (len < 1) return;
      const ux = dx/len, uy = dy/len;
      const ex = x2 - ux * 22, ey = y2 - uy * 22;
      const sx = x1 + ux * 22, sy = y1 + uy * 22;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = selectedId ? (ancestors.has(fromId) && ancestors.has(toId) || (fromId===selectedId||toId===selectedId) ? 2 : 0.8) : 1.2;
      if (dashed) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const cpX = (sx + ex) / 2 - uy * 30, cpY = (sy + ey) / 2 + ux * 30;
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpX, cpY, ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);
      const angle = Math.atan2(ey - cpY, ex - cpX);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 8*Math.cos(angle-0.4), ey - 8*Math.sin(angle-0.4));
      ctx.lineTo(ex - 8*Math.cos(angle+0.4), ey - 8*Math.sin(angle+0.4));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    visibleCourses.forEach(c => {
      c.pre.filter(p => included.has(p)).forEach(pid => {
        const dim = selectedId && !ancestors.has(c.id) && c.id !== selectedId && !descendants.has(pid);
        const highlight = selectedId && (ancestors.has(pid) && (ancestors.has(c.id) || c.id === selectedId));
        const alpha = dim ? 0.04 : highlight ? 0.9 : selectedId ? 0.12 : 0.28;
        const color = completed.has(pid) ? "#10b981" : "#f87171";
        drawEdge(pid, c.id, false, alpha, color);
      });
      c.co.filter(p => included.has(p)).forEach(coid => {
        const dim = selectedId && c.id !== selectedId && coid !== selectedId;
        drawEdge(coid, c.id, true, dim ? 0.03 : 0.22, "#f59e0b");
      });
    });

    // Draw nodes
    visibleCourses.forEach(c => {
      const p = positions[c.id];
      if (!p) return;
      const col = CAT_COLORS[c.cat] || CAT_COLORS["Elective"];
      const isComp = completed.has(c.id);
      const isProg = inProgress.has(c.id);
      const isAvail = isAvailable(c.id);
      const isLocked = !isComp && !isProg && !isAvail;
      const isSel = c.id === selectedId;
      const isAnc = ancestors.has(c.id);
      const isDesc = descendants.has(c.id);
      const dim = selectedId && !isSel && !isAnc && !isDesc ? true : false;

      ctx.save();
      ctx.globalAlpha = dim ? 0.15 : 1;

      // Glow for selected/ancestors
      if (isSel || isAnc) {
        ctx.shadowColor = col.border;
        ctx.shadowBlur = isSel ? 16 : 8;
      }

      // Background
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 6);
      if (isComp) {
        ctx.fillStyle = col.border;
      } else if (isProg) {
        ctx.fillStyle = isDark ? "#1c1f2a" : "#f8fafc";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (isLocked) {
        ctx.fillStyle = isDark ? "rgba(30,32,40,0.5)" : "rgba(245,245,250,0.5)";
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.fillStyle = isDark ? col.fill : col.fill + "22";
        ctx.strokeStyle = col.border;
        ctx.lineWidth = isSel ? 2.5 : 1.2;
        ctx.stroke();
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Code text
      ctx.font = `600 10.5px 'DM Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isComp ? "#fff"
        : isProg ? "#f59e0b"
        : dim ? (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)")
        : isLocked ? (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)")
        : isDark ? col.text : col.border;
      ctx.fillText(c.code, p.x + p.w / 2, p.y + 13, p.w - 6);

      // Name text
      ctx.font = `400 8.5px 'DM Sans', sans-serif`;
      ctx.fillStyle = isComp ? "rgba(255,255,255,0.85)"
        : dim || isLocked ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")
        : isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
      const name = c.name.length > 22 ? c.name.slice(0, 21) + "…" : c.name;
      ctx.fillText(name, p.x + p.w / 2, p.y + 27, p.w - 6);

      // Status dot
      const dotX = p.x + p.w - 8, dotY = p.y + 8;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isComp ? "#4ade80" : isProg ? "#facc15" : isAvail ? "#60a5fa" : "#ef4444";
      ctx.fill();

      ctx.restore();
    });
  }, [courses, included, completed, inProgress, positions, canvasW, canvasH, selectedId, getAncestors, getDescendants, isAvailable, isDark]);

  const handleClick = useCallback(e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const visibleCourses = courses.filter(c => included.has(c.id));
    for (let i = visibleCourses.length - 1; i >= 0; i--) {
      const c = visibleCourses[i];
      const p = positions[c.id];
      if (p && mx >= p.x && mx <= p.x + p.w && my >= p.y && my <= p.y + p.h) {
        onNodeClick(c.id);
        return;
      }
    }
    onNodeClick(null);
  }, [courses, included, positions, onNodeClick]);

  return (
    <canvas ref={canvasRef} onClick={handleClick}
      style={{ cursor: "pointer", display: "block" }} />
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [included, setIncluded] = useState(DEFAULT_INCLUDED);
  const [completed, setCompleted] = useState(new Set());
  const [inProgress, setInProgress] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [panel, setPanel] = useState("manage"); // "manage" | "status" | "info"
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [tooltip, setTooltip] = useState(null);
  const [expandedDept, setExpandedDept] = useState({});
  const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const visibleCourses = useMemo(() =>
    ALL_COURSES.filter(c => included.has(c.id)), [included]);

  const { positions, canvasW, canvasH } = useMemo(() =>
    computeLayout(visibleCourses), [visibleCourses]);

  const selectedCourse = ALL_COURSES.find(c => c.id === selectedId);

  const isAvailable = id => {
    const c = ALL_COURSES.find(x => x.id === id);
    if (!c) return false;
    return c.pre.filter(p => included.has(p)).every(p => completed.has(p));
  };

  const toggleIncluded = id => {
    setIncluded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleStatus = (id, status) => {
    if (status === "completed") {
      setCompleted(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
      setInProgress(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else if (status === "inprogress") {
      setInProgress(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
      setCompleted(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const depts = ["ALL", ...Object.keys(DEPT_GROUPS)];
  const filteredAll = ALL_COURSES.filter(c =>
    (deptFilter === "ALL" || c.dept === deptFilter) &&
    (c.code.toLowerCase().includes(search.toLowerCase()) ||
     c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const byDept = {};
  filteredAll.forEach(c => {
    if (!byDept[c.dept]) byDept[c.dept] = [];
    byDept[c.dept].push(c);
  });

  const stats = {
    total: visibleCourses.length,
    done: visibleCourses.filter(c => completed.has(c.id)).length,
    prog: visibleCourses.filter(c => inProgress.has(c.id)).length,
    avail: visibleCourses.filter(c => !completed.has(c.id) && !inProgress.has(c.id) && isAvailable(c.id)).length,
    units: visibleCourses.filter(c => completed.has(c.id)).reduce((s,c) => s + (c.units || 3), 0),
  };

  const bg = isDark ? "#0f1117" : "#f9fafb";
  const surface = isDark ? "#1a1d27" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#e5e7eb" : "#111827";
  const muted = isDark ? "#6b7280" : "#9ca3af";

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", background:bg, color:text, overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:300, flexShrink:0, background:surface, borderRight:`1px solid ${border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${border}` }}>
          <div style={{ fontSize:13, fontWeight:700, letterSpacing:"0.05em", color: isDark?"#6ee7b7":"#065f46", marginBottom:2, fontFamily:"'DM Mono', monospace" }}>UALBERTA</div>
          <div style={{ fontSize:14, fontWeight:600, lineHeight:1.3 }}>CS Hons · AI Option</div>
          <div style={{ fontSize:11, color:muted, marginTop:2 }}>Prerequisite Spider Web</div>
        </div>

        {/* Stats bar */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:0, borderBottom:`1px solid ${border}` }}>
          {[
            ["Done", stats.done, "#4ade80"],
            ["Active", stats.prog, "#facc15"],
            ["Open", stats.avail, "#60a5fa"],
            ["Units", Math.round(stats.units), "#a78bfa"],
          ].map(([lbl, val, col]) => (
            <div key={lbl} style={{ padding:"10px 8px", textAlign:"center", borderRight:`1px solid ${border}` }}>
              <div style={{ fontSize:16, fontWeight:700, color:col }}>{val}</div>
              <div style={{ fontSize:9, color:muted, letterSpacing:"0.05em" }}>{lbl.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Panel tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${border}` }}>
          {[["manage","Courses"],["status","Status"],["info","Detail"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setPanel(id)}
              style={{ flex:1, padding:"9px 4px", fontSize:11, fontWeight:panel===id?600:400,
                color:panel===id?(isDark?"#6ee7b7":"#065f46"):muted,
                background:"transparent", border:"none", borderBottom:panel===id?`2px solid ${isDark?"#6ee7b7":"#065f46"}`:"2px solid transparent",
                cursor:"pointer", fontFamily:"inherit" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div style={{ flex:1, overflow:"auto" }}>

          {/* MANAGE PANEL */}
          {panel === "manage" && (
            <div>
              <div style={{ padding:"10px 12px 6px", display:"flex", gap:6, flexWrap:"wrap" }}>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search courses…"
                  style={{ flex:1, minWidth:80, padding:"5px 8px", fontSize:11, border:`1px solid ${border}`, borderRadius:6, background:isDark?"#0f1117":"#f3f4f6", color:text, outline:"none" }} />
                <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}
                  style={{ padding:"5px 6px", fontSize:11, border:`1px solid ${border}`, borderRadius:6, background:isDark?"#0f1117":"#f3f4f6", color:text }}>
                  {depts.map(d=><option key={d} value={d}>{d==="ALL"?"All depts":d}</option>)}
                </select>
              </div>
              <div style={{ padding:"0 8px 4px", display:"flex", gap:6 }}>
                <button onClick={()=>setIncluded(DEFAULT_INCLUDED)} style={{ flex:1, fontSize:10, padding:"4px", border:`1px solid ${border}`, borderRadius:5, background:"transparent", color:muted, cursor:"pointer" }}>Reset to default</button>
                <button onClick={()=>setIncluded(new Set(ALL_COURSES.map(c=>c.id)))} style={{ flex:1, fontSize:10, padding:"4px", border:`1px solid ${border}`, borderRadius:5, background:"transparent", color:muted, cursor:"pointer" }}>Include all</button>
              </div>
              {Object.entries(byDept).map(([dept, courses]) => (
                <div key={dept}>
                  <button onClick={()=>setExpandedDept(p=>({...p,[dept]:!p[dept]}))}
                    style={{ width:"100%", padding:"7px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"transparent", border:"none", borderBottom:`1px solid ${border}`, cursor:"pointer", color:text }}>
                    <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.04em" }}>{DEPT_GROUPS[dept]||dept} <span style={{ color:muted, fontWeight:400 }}>({courses.length})</span></span>
                    <span style={{ color:muted, fontSize:12 }}>{expandedDept[dept]===false?"▸":"▾"}</span>
                  </button>
                  {expandedDept[dept]!==false && courses.map(c => {
                    const isIn = included.has(c.id);
                    const col = CAT_COLORS[c.cat]||CAT_COLORS["Elective"];
                    return (
                      <div key={c.id} onClick={()=>toggleIncluded(c.id)}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", cursor:"pointer", borderBottom:`1px solid ${border}`, opacity:isIn?1:0.4,
                          background:selectedId===c.id?(isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"):"transparent" }}>
                        <div style={{ width:14, height:14, borderRadius:3, background:isIn?col.border:"transparent", border:`1.5px solid ${col.border}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {isIn && <span style={{ color:"#fff", fontSize:9, lineHeight:1 }}>✓</span>}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:10.5, fontWeight:600, fontFamily:"'DM Mono',monospace", color:col.border, whiteSpace:"nowrap" }}>{c.code}</div>
                          <div style={{ fontSize:9.5, color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                        </div>
                        <div style={{ marginLeft:"auto", fontSize:9, color:muted, flexShrink:0 }}>{c.units}u</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* STATUS PANEL */}
          {panel === "status" && (
            <div>
              <div style={{ padding:"10px 12px 6px", fontSize:11, color:muted }}>
                Click to cycle: none → completed → in progress
              </div>
              {visibleCourses.sort((a,b)=>a.year-b.year||(a.code>b.code?1:-1)).map(c => {
                const isComp = completed.has(c.id);
                const isProg = inProgress.has(c.id);
                const isAvail = isAvailable(c.id);
                const col = CAT_COLORS[c.cat]||CAT_COLORS["Elective"];
                const statusIcon = isComp ? "✅" : isProg ? "🔵" : isAvail ? "⚪" : "🔒";
                return (
                  <div key={c.id}
                    onClick={()=>{
                      if(isComp){toggleStatus(c.id,"completed");toggleStatus(c.id,"inprogress");}
                      else if(isProg){toggleStatus(c.id,"inprogress");}
                      else{toggleStatus(c.id,"completed");}
                    }}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 12px", cursor:"pointer", borderBottom:`1px solid ${border}`,
                      background: selectedId===c.id?(isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"):"transparent" }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{statusIcon}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10.5, fontWeight:600, fontFamily:"'DM Mono',monospace", color:col.border }}>{c.code}</div>
                      <div style={{ fontSize:9.5, color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    </div>
                    <div style={{ marginLeft:"auto", fontSize:9, color:muted, flexShrink:0 }}>Y{c.year}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DETAIL PANEL */}
          {panel === "info" && (
            <div style={{ padding:12 }}>
              {!selectedCourse ? (
                <div style={{ color:muted, fontSize:12, padding:12, textAlign:"center" }}>
                  Click a node in the web to see course details
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:14, fontWeight:700, fontFamily:"'DM Mono',monospace", color: (CAT_COLORS[selectedCourse.cat]||CAT_COLORS["Elective"]).border, marginBottom:2 }}>{selectedCourse.code}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8, lineHeight:1.3 }}>{selectedCourse.name}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                    {[selectedCourse.cat, `${selectedCourse.units} units`, `Year ${selectedCourse.year}`].map(t=>(
                      <span key={t} style={{ fontSize:10, padding:"2px 7px", borderRadius:20, border:`1px solid ${border}`, color:muted }}>{t}</span>
                    ))}
                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:
                      completed.has(selectedCourse.id)?"#064e3b":inProgress.has(selectedCourse.id)?"#78350f":isAvailable(selectedCourse.id)?"#1e3a5f":"#3b0764",
                      color: completed.has(selectedCourse.id)?"#6ee7b7":inProgress.has(selectedCourse.id)?"#fde68a":isAvailable(selectedCourse.id)?"#93c5fd":"#d8b4fe" }}>
                      {completed.has(selectedCourse.id)?"✓ Done":inProgress.has(selectedCourse.id)?"In progress":isAvailable(selectedCourse.id)?"Available":"Locked"}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:muted, marginBottom:12, lineHeight:1.5 }}>{selectedCourse.desc}</div>

                  {[["Prerequisites", selectedCourse.pre], ["Corequisites", selectedCourse.co]].map(([lbl, ids]) => ids.length > 0 && (
                    <div key={lbl} style={{ marginBottom:10 }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.05em", color:muted, marginBottom:4 }}>{lbl.toUpperCase()}</div>
                      {ids.map(id => {
                        const pc = ALL_COURSES.find(x=>x.id===id);
                        if(!pc) return <div key={id} style={{ fontSize:11, color:muted }}>{id}</div>;
                        const col2 = CAT_COLORS[pc.cat]||CAT_COLORS["Elective"];
                        return (
                          <div key={id} onClick={()=>{setSelectedId(id);setPanel("info");}}
                            style={{ display:"flex", gap:6, padding:"4px 0", cursor:"pointer", borderBottom:`1px solid ${border}` }}>
                            <span style={{ fontSize:10, fontWeight:600, fontFamily:"'DM Mono',monospace", color:col2.border }}>{pc.code}</span>
                            <span style={{ fontSize:10, color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pc.name}</span>
                            <span style={{ marginLeft:"auto", fontSize:10 }}>{completed.has(id)?"✅":inProgress.has(id)?"🔵":isAvailable(id)?"⚪":"🔒"}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {selectedCourse.url && (
                    <a href={selectedCourse.url} target="_blank" rel="noreferrer"
                      style={{ fontSize:11, color: isDark?"#6ee7b7":"#065f46", textDecoration:"none", display:"block", marginTop:8 }}>
                      View in UAlberta Catalogue →
                    </a>
                  )}

                  <div style={{ display:"flex", gap:6, marginTop:12 }}>
                    <button onClick={()=>toggleStatus(selectedCourse.id,"completed")}
                      style={{ flex:1, padding:"6px", fontSize:11, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer",
                        background:completed.has(selectedCourse.id)?"#064e3b":"transparent",
                        color:completed.has(selectedCourse.id)?"#6ee7b7":text }}>
                      {completed.has(selectedCourse.id)?"✓ Completed":"Mark done"}
                    </button>
                    <button onClick={()=>toggleStatus(selectedCourse.id,"inprogress")}
                      style={{ flex:1, padding:"6px", fontSize:11, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer",
                        background:inProgress.has(selectedCourse.id)?"#78350f":"transparent",
                        color:inProgress.has(selectedCourse.id)?"#fde68a":text }}>
                      {inProgress.has(selectedCourse.id)?"🔵 In progress":"Mark active"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ borderTop:`1px solid ${border}`, padding:"8px 12px" }}>
          <div style={{ fontSize:9, color:muted, marginBottom:4, letterSpacing:"0.06em" }}>LEGEND</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 10px" }}>
            {[["✅","Completed"],["🔵","In progress"],["⚪","Available"],["🔒","Locked"]].map(([i,l])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:3, fontSize:10, color:muted }}>
                <span style={{ fontSize:11 }}>{i}</span>{l}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 10px", marginTop:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:muted }}>
              <div style={{ width:16, height:2, background:"#f87171" }}/> Prereq
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:muted }}>
              <div style={{ width:16, height:2, background:"#f59e0b", borderTop:"2px dashed #f59e0b" }}/> Coreq
            </div>
          </div>
        </div>
      </div>

      {/* Main web canvas */}
      <div style={{ flex:1, overflow:"auto", position:"relative" }}>
        {/* Top bar */}
        <div style={{ position:"sticky", top:0, zIndex:10, background:surface, borderBottom:`1px solid ${border}`, padding:"8px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:11, color:muted }}>
            <span style={{ fontWeight:600, color:text }}>{visibleCourses.length}</span> courses shown
            {selectedId && <span> · <span style={{ fontWeight:600, color:(CAT_COLORS[selectedCourse?.cat]||CAT_COLORS["Elective"]).border }}>{selectedCourse?.code}</span> selected</span>}
          </div>
          {selectedId && (
            <button onClick={()=>setSelectedId(null)}
              style={{ marginLeft:"auto", fontSize:11, padding:"3px 10px", border:`1px solid ${border}`, borderRadius:5, background:"transparent", cursor:"pointer", color:muted }}>
              Clear selection
            </button>
          )}
          <div style={{ marginLeft:selectedId?"0":"auto", display:"flex", gap:6, flexWrap:"wrap" }}>
            {Object.entries(CAT_COLORS).slice(0,5).map(([cat,col])=>(
              <div key={cat} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:muted }}>
                <div style={{ width:8, height:8, borderRadius:2, background:col.border }} />{cat}
              </div>
            ))}
          </div>
        </div>

        {visibleCourses.length === 0 ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:400, color:muted, fontSize:14 }}>
            No courses selected. Use the Courses panel to add courses.
          </div>
        ) : (
          <SpiderWeb
            courses={ALL_COURSES}
            included={included}
            completed={completed}
            inProgress={inProgress}
            positions={positions}
            canvasW={canvasW}
            canvasH={canvasH}
            selectedId={selectedId}
            onNodeClick={id => { setSelectedId(id); if(id) setPanel("info"); }}
          />
        )}
      </div>
    </div>
  );
}
