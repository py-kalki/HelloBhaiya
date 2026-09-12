# 🚀 HelloBhaiya — Gamified NEET & JEE Preparation Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/py-kalki/HelloBhaiya/main/public/hellobhaiya-logo.svg" alt="HelloBhaiya Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>The dark-themed, gamified, mobile-first ecosystem engineered for high-yield NEET & JEE preparation.</strong>
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/Anthropic-Claude_3.5-D97706?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic Claude" /></a>
  <a href="#-testing--quality-assurance"><img src="https://img.shields.io/badge/Tests-Vitest_%26_Playwright-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest & Playwright" /></a>
  <a href="#-internationalization-i18n"><img src="https://img.shields.io/badge/Languages-EN_%7C_%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-orange?style=for-the-badge" alt="Localization" /></a>
</p>

---

## 📖 Table of Contents

- [Overview & Vision](#-overview--vision)
- [Key Features & Modules](#-key-features--modules)
  - [1. Dynamic Custom Test Engine](#1-dynamic-custom-test-engine)
  - [2. 1v1 PvP Quiz Battle Mode](#2-1v1-pvp-quiz-battle-mode)
  - [3. SM-2 Spaced Repetition Revision](#3-sm-2-spaced-repetition-revision)
  - [4. AI Doubt Solver (Bhaiya AI)](#4-ai-doubt-solver-bhaiya-ai)
  - [5. Deep Analytics & NEET Score Predictor](#5-deep-analytics--neet-score-predictor)
  - [6. Gamified Roadmap, XP & Streaks](#6-gamified-roadmap-xp--streaks)
  - [7. Community Notes & In-Browser Annotator](#7-community-notes--in-browser-annotator)
  - [8. Focus Study & Virtual Study Rooms](#8-focus-study--virtual-study-rooms)
  - [9. Smart Timetable & Daily Goals](#9-smart-timetable--daily-goals)
  - [10. Dynamic Leaderboards & Friend Codes](#10-dynamic-leaderboards--friend-codes)
  - [11. Institutional & Educator Portal](#11-institutional--educator-portal)
  - [12. PDF Scorecard Generation](#12-pdf-scorecard-generation)
- [System Architecture & Design Principles](#-system-architecture--design-principles)
- [Tech Stack](#-tech-stack)
- [Database Schema & Collections](#-database-schema--collections)
- [Core Algorithms & Formulas](#-core-algorithms--formulas)
- [Directory Structure](#-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Data Ingestion & CLI Scripts](#-data-ingestion--cli-scripts)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Guide](#-deployment-guide)
- [License & Contributing](#-license--contributing)

---

## 🌟 Overview & Vision

**HelloBhaiya** is an all-in-one edtech web application designed specifically for Indian medical and engineering aspirants preparing for **NEET UG**, **JEE Main**, and **JEE Advanced**. 

Unlike conventional test-prep platforms that feel like chore-heavy exam portals, HelloBhaiya re-imagines competitive exam preparation as an immersive, gamified RPG:
- **Zero-Stress Learning:** Turn daunting multi-year syllabi into bite-sized quests, daily micro-goals, and progression milestones.
- **Scientific Retention:** Utilizes the **SuperMemo-2 (SM-2)** algorithm and chapter health decay models to guarantee long-term formula and concept retention.
- **Peer Competition:** Real-time 1v1 peer quiz battles and weekly city/regional leaderboards keep adrenaline and motivation high.
- **Accessible & Multilingual:** Built mobile-first with high-contrast OLED dark themes and bilingual support in **English** and **Hindi (हिंदी)**.

---

## ⚡ Key Features & Modules

```
                                  ┌───────────────────────────────┐
                                  │         HelloBhaiya           │
                                  │      NEET/JEE Ecosystem       │
                                  └──────────────┬────────────────┘
                 ┌───────────────────────────────┼───────────────────────────────┐
                 │                               │                               │
        ┌────────┴────────┐             ┌────────┴────────┐             ┌────────┴────────┐
        │  Test Engine &  │             │   Retention &   │             │   Social & AI   │
        │   Evaluation    │             │   Roadmaps      │             │  Collaboration  │
        ├─────────────────┤             ├─────────────────┤             ├─────────────────┤
        │ • Custom Tests  │             │ • SM-2 Revision │             │ • 1v1 Battles   │
        │ • PYQ Practice  │             │ • Chapter Health│             │ • Bhaiya AI     │
        │ • Rapid Fire    │             │ • XP & Badges   │             │ • Study Rooms   │
        │ • PDF Reports   │             │ • Timetables    │             │ • Notes Vault   │
        └─────────────────┘             └─────────────────┘             └─────────────────┘
```

### 1. Dynamic Custom Test Engine
- **Multiple Test Modes:** Create personalized tests via `CUSTOM`, `PYQ` (Previous Year Questions with year range filtering), `RAPID_FIRE`, `MISTAKE_REPLAY` (targeting past wrong questions), and `REVISION` modes.
- **Custom Granularity:** Select specific subjects (Physics, Chemistry, Biology, Mathematics), chapters, difficulty distributions (Easy/Medium/Hard), numerical percentage, and custom timers.
- **Authentic Exam UI:** Full-screen exam interface equipped with a question status palette (Answered, Flagged, Unattempted), live countdown timer, and KaTeX mathematical formula rendering.
- **Accurate Marking Schemes:** Automatic evaluation supporting **NEET** (+4/-1), **JEE Main** (+4/-1), and **JEE Advanced** (+4/-2 with partial marking for multiple correct options).

### 2. 1v1 PvP Quiz Battle Mode
- **Real-Time Multiplayer Quizzing:** Challenge friends or match with peers using unique 6-character battle invite codes.
- **Synchronized 10-Question Duels:** Real-time opponent progress updates, answer state synchronizations, and instant head-to-head scorecards.
- **Instant Result Determination:** Tie-breakers resolved via completion time down to the second.

### 3. SM-2 Spaced Repetition Revision
- **SuperMemo-2 Implementation:** Automatically tracks repetitions, interval multipliers, and ease factors per topic.
- **Chapter Health Decay:** Calculates chapter health based on accuracy (60%), recency decay (20%), and volume attempted (20%).
- **Smart Urgency Queue:** Prioritizes topics that are slipping from memory before critical retention decay sets in.

### 4. AI Doubt Solver (Bhaiya AI)
- **Anthropic Claude 3.5 Sonnet:** High-speed, context-aware conceptual breakdown and step-by-step numerical explanations.
- **LaTeX Math Output:** Formatted mathematical derivations, step highlights, and related concept recommendations.
- **Tier-Gated Quotas:** Free users receive daily allowance tokens, with unlimited access for Pro subscribers.

### 5. Deep Analytics & NEET Score Predictor
- **NEET Score Prediction (0–720 Scale):** Rolling accuracy weighted predictor simulating real exam condition bounds ($[Low, High]$ interval).
- **Mastery Radar & Accuracy Split:** Visual breakdowns across subjects, chapters, and question types with time-per-question velocity analysis.
- **Mistake Bank (Error Notebook):** Automatic collection of incorrectly answered questions for targeted remediation.

### 6. Gamified Roadmap, XP & Streaks
- **30-Tier Level System:** Progress from *Rookie (Lvl 1)* to *Atom (Lvl 5)*, *Molecule (Lvl 10)*, *Catalyst (Lvl 15)*, *Scholar (Lvl 20)*, up to *NEET Legend (Lvl 30)*.
- **XP Multipliers:** Earn XP from test accuracy, completion speed bonuses, and daily streak milestones.
- **Streak Protection:** Daily streak tracking with streak freeze saves so learners don't lose momentum.

### 7. Community Notes & In-Browser Annotator
- **Crowdsourced & Curated Notes:** Access topper handwritten formulas, summary notes, and cheat sheets.
- **Integrated PDF Reader:** High-performance PDF renderer with multi-color highlighter annotator (`yellow`, `green`, `pink`).
- **Community Rating & Reviews:** 5-star peer rating system with download and view metrics.

### 8. Focus Study & Virtual Study Rooms
- **Integrated Pomodoro Timer:** Configurable focus cycles (25/50 mins) and breaks with persistent session logging.
- **Virtual Study Rooms:** Collaborative video study sessions powered by the `@jitsi/react-sdk` embedded directly in the app.

### 9. Smart Timetable & Daily Goals
- **Personalized Daily Schedule:** Interactive time-slot manager for study, revision, and practice blocks.
- **AI Micro-Goals:** Daily automatically generated task goals with daily refresh limits and completion check-ins.

### 10. Dynamic Leaderboards & Friend Codes
- **Weekly Competition:** Real-time leaderboard updated on test completions.
- **City & Exam Filters:** Compare performance against peers in your target city or specific exam category.
- **Social Invites:** Share personal friend codes to build study circles and earn referral XP bonuses.

### 11. Institutional & Educator Portal
- **Educator Dashboard:** Multi-tenant institution management for coaching institutes and teachers.
- **Classroom Join Codes:** Create classes, issue join codes, and inspect cohort-level accuracy, weak areas, and weekly XP stats.

### 12. PDF Scorecard Generation
- **Shareable Test Certificates:** Generate branded, vector-quality PDF scorecards directly in the browser using `jsPDF` and `html2canvas`.
- **Social Share Cards:** Dynamically generated OpenGraph/Twitter share cards showcasing scores, accuracy, and test statistics.

---

## 🏗️ System Architecture & Design Principles

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                           CLIENT                                 │
  │  Next.js 16 App Router · React 19 · Tailwind v4 · Framer Motion  │
  └───────────────────────────────┬──────────────────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │  Zero-Latency Test Store    │
                   │   (Zustand Local State)     │
                   └──────────────┬──────────────┘
                                  │ On Submit
                                  ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │                    SERVER ACTIONS & API LAYER                    │
  │  • verifySession() Cookie Guard                                  │
  │  • Rate Limiting & Input Validation                              │
  │  • Scoring, XP & SM-2 Algorithmic Execution                      │
  └──────────────┬───────────────────────────────┬───────────────────┘
                 │                               │
                 ▼                               ▼
  ┌──────────────────────────────┐ ┌─────────────────────────────────┐
  │      FIREBASE SERVICES       │ │         AI INFERENCE            │
  │ • Cloud Firestore (Batches)  │ │ • Anthropic Claude API          │
  │ • Firebase Authentication    │ │   (Claude 3.5 Sonnet)           │
  │ • Cloud Storage (Notes/PDFs) │ └─────────────────────────────────┘
  │ • Cloud Messaging (FCM Push) │
  └──────────────────────────────┘
```

### Core Architecture Rules
1. **Strict Session Verification:** Every Next.js Server Action authenticates callers using `verifySession()` backed by Firebase Admin SDK session cookies.
2. **Zero-Latency In-Memory State:** During active test sessions, answers and timer states live exclusively in Zustand (`stores/testStore.ts`). No per-question network calls are made until final batch submission.
3. **Optimized Firestore Writes:** Multi-document updates (scores, user XP, level upgrades, streak increments, daily goals, and leaderboard updates) are committed atomically using Firestore `WriteBatch`.
4. **Strict Query Bounds:** All Firestore client queries enforce `limit()` clauses to prevent unbounded collection reads and minimize billing overhead.
5. **Strict Bundle Budget (< 150KB):** Heavy client libraries (MathJax/KaTeX, Recharts, Framer Motion, Jitsi SDK, jsPDF, Three.js) are lazily loaded using `next/dynamic`.
6. **Mobile-First Accessibility:** Minimum interactive tap targets of 44×44px across all touch controls.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Purpose |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Core SSR, Server Actions, React Compiler, Turbopack |
| **UI & Rendering** | [React 19](https://react.dev/) | Component architecture & modern concurrent primitives |
| **Language** | [TypeScript 5 (Strict)](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Dark OLED design system & accessible component primitives |
| **Animations & 3D** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) + [Three.js](https://threejs.org/) | Micro-interactions, smooth landing scroll, and 3D graphics |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight, decoupled test and UI state store |
| **Database & Auth** | [Firebase Firestore & Auth](https://firebase.google.com/) | Realtime NoSQL database, Google OAuth, and session tokens |
| **Admin SDK** | [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | Secure server-side database manipulations & verification |
| **AI Doubt Solver** | [Anthropic Claude SDK](https://www.anthropic.com/) | Step-by-step conceptual AI tutor |
| **Charts & Metrics** | [Recharts](https://recharts.org/) | Performance analytics and subject mastery visualizations |
| **Virtual Study** | [@jitsi/react-sdk](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk/) | Collaborative peer video study rooms |
| **PDF & Canvas** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) + [react-pdf](https://react-pdf.org/) | Test report generation and notes reading |
| **Internationalization**| [next-intl](https://next-intl-docs.vercel.app/) | Bilingual localization (English & Hindi) |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit testing algorithms and End-to-End browser tests |
| **Analytics** | [PostHog](https://posthog.com/) | Product analytics and event tracking |

---

## 🗄️ Database Schema & Collections

```
cloud.firestore
├── users/{uid}                            # User profile, XP, streak, chapter health
│   ├── tests/{testId}                     # Test sessions, answers, scores, timestamps
│   ├── templates/{templateId}             # Saved custom test configurations
│   ├── timetable/{dayId}                  # Day-by-day study schedule
│   ├── dailyGoal/current                  # Active daily micro-goals
│   └── dailyTasks/{taskId}                # Checkable daily study checklist
├── questions/{questionId}                 # Bank of NEET & JEE questions with explanations
├── notes/{noteId}                         # Uploaded formula sheets and chapter notes
│   └── ratings/{raterUid}                 # User ratings and feedback
├── battles/{battleId}                     # 1v1 PvP real-time quiz matches
├── leaderboard/weekly/entries/{uid}       # Aggregated weekly leaderboard entries
├── institutions/{institutionId}           # Registered schools & coaching academies
│   └── classes/{classId}                  # Classrooms and enrolled student UIDs
└── syllabus/{docId}                       # Standardized NEET & JEE curriculum maps
```

---

## 🧮 Core Algorithms & Formulas

### 1. Scoring Engine (`lib/scoring.ts`)
$$\text{Score}_{\text{NEET/JEE}} = (4 \times \text{Correct}) - (1 \times \text{Wrong}) + (0 \times \text{Unattempted})$$

For **JEE Advanced Multiple-Choice Questions (MCQ_MULTI)**:
- All correct options selected: $+4$ marks
- Any incorrect option selected: $-2$ marks
- Partial correct options (with zero incorrect): $+1$ mark per correct option

### 2. XP Reward Formula
$$\text{XP}_{\text{earned}} = \text{Base}(100) + \text{AccuracyBonus} + \text{SpeedBonus}$$
- **Accuracy Bonus:** $+200\text{ XP}$ (if accuracy $> 80\%$), $+100\text{ XP}$ (if accuracy $\ge 60\%$)
- **Speed Bonus:** $+50\text{ XP}$ (if completed in $< 70\%$ of allotted time)

### 3. Chapter Health Metric
$$\text{Health} = \text{round}(0.6 \times \text{Accuracy} + 0.2 \times \text{Recency} + 0.2 \times \text{Volume})$$
- $\text{Recency} = \max(0, 100 - \text{DaysSinceLastPractice} \times \frac{100}{14})$
- $\text{Volume} = \min(\frac{\text{QuestionsAttempted}}{30}, 1) \times 100$

### 4. SuperMemo-2 (SM-2) Spaced Repetition (`lib/sm2.ts`)
- **If Accuracy $< 60\%$:** Reset interval to 1 day; decrease Ease Factor ($EF = \max(1.3, EF - 0.2)$); repetitions reset to 0.
- **If $60\% \le \text{Accuracy} < 80\%$:** Hold existing interval.
- **If Accuracy $\ge 80\%$:**
  $$I(0) = 1, \quad I(1) = 6, \quad I(n) = \text{round}(I(n-1) \times EF)$$
  $$EF_{\text{new}} = \max(1.3, EF + 0.1)$$

---

## 📁 Directory Structure

```
HelloBhaiya/
├── actions/                  # Next.js Server Actions (submitTest, askDoubt, createBattle, etc.)
├── app/                      # Next.js 16 App Router pages and layout groups
│   ├── (auth)/               # Authentication & Onboarding routes
│   ├── (institution)/        # Coaching & Institution management portal
│   ├── (main)/               # Core student platform:
│   │   ├── analytics/        # Performance trends, score prediction, topic mastery
│   │   ├── battle/           # 1v1 PvP quiz arena & matchmaking
│   │   ├── dashboard/        # Main hub, active quests, quick test launcher
│   │   ├── doubt/            # AI Doubt Solver with Anthropic Claude
│   │   ├── leaderboard/      # Global & regional leaderboard rankings
│   │   ├── notes/            # Notes library, PDF reader & highlighter
│   │   ├── pricing/          # Subscription & token plans
│   │   ├── profile/          # User avatar, stats, badges, exam targets
│   │   ├── revision/         # Spaced repetition flashcards & decay tracker
│   │   ├── roadmap/          # Gamified syllabus progression tree
│   │   ├── settings/         # Preferences, theme, language & notifications
│   │   ├── study/            # Pomodoro study sessions & history
│   │   ├── study-room/       # Jitsi Meet virtual video study rooms
│   │   ├── test/             # Test builder & interactive test engine
│   │   └── timetable/        # Smart daily timetable & micro-goals
│   ├── api/                  # API routes (Auth session cookie handlers)
│   ├── share/                # Dynamic test result share pages
│   ├── layout.tsx            # Root layout with fonts, providers & metadata
│   └── page.tsx              # High-conversion GSAP animated landing page
├── components/               # Modular UI component library
│   ├── analytics/            # Recharts components, score cards, mastery gauges
│   ├── battle/               # Real-time battle UI & opponent progress bars
│   ├── dashboard/            # Streak counters, XP progress, quest widgets
│   ├── doubt/                # AI chat interface, math output renderer
│   ├── landing/              # Hero, 3D Canvas, roadmaps, animated feature bento
│   ├── notes/                # PDF viewer, annotation toolbar, rating modal
│   ├── results/              # Score breakdown, wrong answer review, PDF template
│   ├── test/                 # Test questions, palette, options, timer
│   └── ui/                   # shadcn / Base UI dark primitives
├── i18n/                     # next-intl configuration & locale negotiation
├── lib/                      # Pure business logic, algorithms & Firebase clients
│   ├── firebase/             # Client & Admin Firebase initialization
│   ├── scoring.ts            # Scoring logic, XP calculation, chapter health
│   ├── sm2.ts                # SM-2 Spaced Repetition implementation
│   ├── predictedScore.ts     # NEET score predictor model
│   └── syllabusData.ts       # Structured NEET/JEE chapter & topic database
├── messages/                 # Localization dictionaries
│   ├── en.json               # English language strings
│   └── hi.json               # Hindi language strings (हिंदी)
├── public/                   # Static assets, sound effects, favicons
├── scripts/                  # Data seeding & migration scripts
├── stores/                   # Zustand state stores (testStore.ts)
├── tests/                    # Vitest unit tests & Playwright E2E suites
├── types/                    # TypeScript interfaces & domain models
├── firestore.rules           # Security rules for Firestore collections
└── next.config.ts            # Next.js bundler, images & security headers config
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **Firebase Project**: A Firebase project with Firestore, Authentication (Email/Password & Google Sign-In), and Storage enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/py-kalki/HelloBhaiya.git
cd HelloBhaiya
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp .env.local.example .env.local
```
*(Refer to the [Environment Variables Configuration](#-environment-variables-configuration) section below for detailed key descriptions).*

### 4. Deploy Firestore Rules & Indexes (Optional for local test against production Firebase)
```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

### 5. Seed Questions & Syllabus Data
```bash
# Seed standard questions into Firestore
npx ts-node -r tsconfig-paths/register scripts/importQuestions.ts ./scripts/data/sampleQuestions.json
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables Configuration

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client / Public | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client / Public | Firebase Auth Domain (e.g., `app.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client / Public | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client / Public | Firebase Storage Bucket URL |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client / Public | Firebase Cloud Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client / Public | Firebase Web App ID |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Client / Public | Web Push Certificate Key (FCM) |
| `NEXT_PUBLIC_APP_URL` | Client / Public | Root URL of the application (`http://localhost:3000`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Client / Public | PostHog Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Client / Public | PostHog Host (default `https://app.posthog.com`) |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT` | **Server Only** | JSON stringified Firebase Service Account private key |
| `ANTHROPIC_API_KEY` | **Server Only** | Anthropic API key for Bhaiya AI Doubt Solver |
| `RESEND_API_KEY` | **Server Only** | Resend API key for transactional emails |
| `SENTRY_DSN` | **Server Only** | Sentry DSN for production crash reporting |

> [!WARNING]
> **Never** expose `FIREBASE_ADMIN_SERVICE_ACCOUNT` or `ANTHROPIC_API_KEY` to client-side bundles. Never prefix them with `NEXT_PUBLIC_`.

---

## 📥 Data Ingestion & CLI Scripts

HelloBhaiya includes CLI tools for bulk importing questions, syllabus structures, and study notes into Firestore.

### Import Questions (JSON or CSV)
Validate against JSON schema and import in chunks of 500:
```bash
# JSON Import
npx ts-node -r tsconfig-paths/register scripts/importQuestions.ts ./path/to/questions.json

# CSV Import
npx ts-node -r tsconfig-paths/register scripts/importQuestions.ts ./path/to/questions.csv
```

### Import Notes & Study Material
```bash
npx ts-node -r tsconfig-paths/register scripts/importNotes.ts ./path/to/notes.json
```

---

## 🧪 Testing & Quality Assurance

HelloBhaiya maintains rigorous quality standards using Vitest for unit tests and Playwright for E2E user flow tests.

```bash
# Run unit tests (Scoring, SM-2, Predicted Score, Entitlements)
npm run test

# Run unit tests in interactive watch mode
npm run test:watch

# Launch Vitest UI
npm run test:ui

# Run End-to-End browser tests (requires dev server running)
npm run test:e2e

# Run TypeScript strict type verification
npm run type-check

# Run ESLint check
npm run lint

# Run Next.js bundle size analyzer
npm run analyze
```

---

## 🌐 Internationalization (i18n)

HelloBhaiya supports seamless multilingual localization using `next-intl`:
- **Default Locale:** English (`en`)
- **Supported Locales:** English (`en`), Hindi (`hi`)
- **Switching Locales:** Handled seamlessly via user preferences in Settings or the language picker action (`actions/setLocale.ts`), which sets a persistent cookie.

---

## 🚀 Deployment Guide

### Deploying on Vercel
1. Push your repository to GitHub / GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, add all keys listed in `.env.local.example`.
4. Ensure `FIREBASE_ADMIN_SERVICE_ACCOUNT` contains the exact JSON string of your service account.
5. Deploy! Next.js 16 build optimizations and route bundling will run automatically.

### Deploying Firestore Rules & Security
```bash
# Login to Firebase CLI
firebase login

# Set active project
firebase use <your-project-id>

# Deploy security rules and database indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

---

## 🤝 Contributing

Contributions are what make the open-source and edtech community a great place to build! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Run test and lint checks (`npm run type-check && npm run test && npm run lint`)
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ for every NEET & JEE aspirant striving to achieve their dream rank.
  <br />
  <strong>Padho aise ki selection pakka ho! 🎯</strong>
</p>
