# clean-code.md — Code Structure & Conventions

Rules for how code in this project should be organized and written. Applies to every phase, every agent (Copilot, Gemini CLI, Claude, OpenCode).

---

## Folder Structure (Next.js App Router)

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/           — login/signup routes, grouped, no effect on URL
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── exercise/[id]/
│   │   ├── layout.js
│   │   ├── page.js            — landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                — generic reusable pieces (Button, Card, Badge)
│   │   └── [feature]/          — feature-specific components (e.g. dashboard/PlanCard.jsx)
│   ├── lib/
│   │   ├── supabase.js         — Supabase client setup
│   │   ├── gemini.js           — Gemini API helper functions
│   │   └── overload.js         — progressive overload logic (pure functions)
│   └── styles/                 — only if needed beyond Tailwind + globals.css
├── public/
├── AGENTS.md
├── design.md
├── clean-code.md
└── gym-tracker-spec.md
```

**Rule:** one component = one file. If a component needs sub-pieces, put them in the same folder, not all crammed in one file.

---

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| Component files | PascalCase | `PlanCard.jsx` |
| Utility/lib files | camelCase | `overload.js` |
| Folders | kebab-case | `exercise-detail/` |
| React components | PascalCase | `function PlanCard() {}` |
| Functions/variables | camelCase | `getCurrentTarget()` |
| Supabase tables/columns | snake_case (matches DB) | `current_target`, `workout_logs` |
| CSS classes (Tailwind) | utility-first, no custom class names unless necessary | — |

---

## Component Rules

- **Keep components small.** If a component file is doing more than one clear job (e.g. fetching data AND rendering a complex layout AND handling form state), split it.
- **Server vs Client components:** default to Server Components. Only add `"use client"` when you actually need interactivity (forms, onClick, useState, etc.) — keeps the app fast and is the whole point of App Router.
- **No business logic inside components.** Things like the progressive-overload calculation belong in `lib/overload.js` as a pure function, not inline inside a component. Components call the function and render the result.
- **Props over prop-drilling chains.** If you're passing the same prop through 3+ levels, consider whether that data should come from a shared fetch closer to where it's needed instead.

---

## Data Fetching Rules

- Supabase calls live in `lib/supabase.js` (client setup) and feature-specific fetch functions — don't scatter raw Supabase queries directly inside components.
- Gemini API calls live in `lib/gemini.js` — one function per use case (e.g. `parsePlanFromText()`, `checkOverload()`, `weeklyReview()`), not one giant catch-all function.
- Never call Gemini directly from a component — always through a `lib/gemini.js` function, so the trigger logic (event-driven/scheduled/manual — see `AGENTS.md`) stays centralized and easy to audit.

---

## Styling Rules

- Tailwind utility classes only — no separate CSS files per component unless there's a genuinely complex case Tailwind can't express cleanly.
- Match tokens defined in `design.md` — don't hardcode one-off hex colors in components; if a color isn't in the design system yet, flag it instead of guessing.
- Reuse `components/ui/` pieces (Button, Card, Badge) instead of rebuilding button/card styles inline each time.

---

## General Rules

- **No dead code left in.** If Copilot/Cursor/etc. generates something and you replace it, delete the old version — don't leave commented-out blocks around.
- **Comments explain *why*, not *what*.** `// recalculate target after 3 consecutive hits` is useful; `// loop through array` is not.
- **One feature per commit/session where possible** — makes it easier to track what changed and roll back if an agent breaks something.
- **Environment variables** (Supabase keys, Gemini API key) go in `.env.local`, never hardcoded, never committed. Check `.gitignore` includes `.env.local` before your first commit.

---

## Reference
Design tokens: `design.md`. Data model + Gemini trigger rules + build order: `AGENTS.md` and `gym-tracker-spec.md`.