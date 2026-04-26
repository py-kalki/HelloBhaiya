@AGENTS.md

# HelloBhaiya — Claude Code Context

## What This Project Is

HelloBhaiya is a dark-themed, gamified, mobile-first web platform for Indian NEET/JEE aspirants. Students build custom tests, earn XP, track chapter health via spaced repetition, and follow a gamified study roadmap.

Planning docs live in the **parent directory** (`../`):
- `HelloBhaiya_PRD_v1.0.md` — product requirements
- `HelloBhaiya_BackendScheme_v1.0.md` — Firestore schemas, Server Actions, algorithms
- `HelloBhaiya_ImplementationPlan_v1.0.md` — 24-sprint roadmap
- `HelloBhaiya_TechStack_v1.0.md` — technology choices

Custom slash commands are in `../.claude/commands/` — invoke with `/new-action`, `/ux-designer`, etc.

---

## Commands

```bash
npm run dev          # localhost:3000
npm run type-check   # tsc --noEmit — must pass before every PR
npm run lint         # eslint
npm run test         # vitest run (unit tests)
npm run test:watch   # vitest watch
npm run test:e2e     # playwright (requires dev server running)
npm run analyze      # bundle size analysis
```

---

## Stack

Next.js 16 App Router · TypeScript 5 strict · Tailwind v4 · shadcn/ui · Framer Motion · Recharts · Zustand · Firebase (Firestore + Auth + Storage + FCM) · Anthropic Claude API · Vitest · Playwright

---

## Architecture Rules (enforce always)

1. Every Server Action starts with `verifySession()` — see `lib/firebase/admin.ts`
2. `ANTHROPIC_API_KEY` and `FIREBASE_ADMIN_SERVICE_ACCOUNT` are server-only — never `NEXT_PUBLIC_`
3. Test answers live in Zustand (`stores/testStore.ts`) until submission — never per-answer Firestore writes
4. PDF template (`components/results/pdf/`) uses hardcoded inline styles only — no Tailwind, no CSS vars
5. Initial JS bundle < 150KB — MathJax, Recharts, Framer Motion, jsPDF are all `dynamic()` imports
6. All Firestore queries must have `limit()` — no unbounded collection reads
7. Batch writes for multi-document updates (scoring, XP, streaks)
8. Minimum tap target 44×44px on all interactive elements

---

## Key File Locations

| What | Where |
|---|---|
| Scoring engine | `lib/scoring.ts` |
| SM-2 algorithm | `lib/sm2.ts` |
| Predicted score | `lib/predictedScore.ts` |
| Active test state | `stores/testStore.ts` |
| Firebase client | `lib/firebase/client.ts` |
| Firebase admin | `lib/firebase/admin.ts` |
| Auth session API | `app/api/auth/session/route.ts` |
| Auth guard | `middleware.ts` |
| Design tokens | `app/globals.css` |
| All types | `types/` |

---

## Design Tokens (Tailwind classes)

`bg-background` `bg-surface` `bg-surface-2` `border-border`
`text-text-primary` `text-text-secondary` `text-text-muted`
`text-accent` `text-success` `text-warning` `text-danger`
`bg-success` `bg-warning` `bg-danger`
