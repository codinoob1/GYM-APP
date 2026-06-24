# Gym Tracker — AI Coach PWA
### Build Spec for Cursor-Assisted Development

> **How to use this doc with Cursor:** Work through the phases in order. At the start of each phase, paste that phase's section into Cursor and ask it to implement *only that phase*. Review and test before moving to the next one. Don't paste the whole doc and say "build this" — that produces an unreviewable wall of code. This doc is the map; you and Cursor drive turn by turn.

---

## 1. Core Concept

A gym-tracking webapp, installed like a native app via "Add to Home Screen," where an AI (Gemini) turns a user's existing workout plan into a structured, trackable plan and manages progressive overload over time.

**The loop:**
1. User provides their current plan (pasted text or PDF) + basic stats (height/weight/age) + a current photo.
2. Gemini parses this into a structured plan: exercises, sets/reps/weight targets, alternates, and a per-exercise overload rule.
3. User logs workouts over time.
4. Gemini decides — per the overload rule — whether to bump weight, bump reps, or hold, based on what was actually logged.
5. Weekly (or on demand), Gemini reviews the whole plan for plateaus/imbalances and can suggest bigger changes.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router)** | You want to learn it; good Cursor scaffolding support |
| Backend/DB | **Supabase** (Postgres + JSONB + Auth + Storage) | One service for DB, auth, and photo storage; JSONB solves the "messy nested plan data" problem without going full NoSQL |
| AI | **Gemini API** | Already your plan |
| PWA | `next-pwa` (or hand-rolled manifest + service worker) | Add-to-home-screen + offline caching |
| Offline queue | **IndexedDB** (via `idb` library) in the browser | Holds unsynced workout logs until back online |

Auth: Supabase Auth, email/password or magic link. Small/limited user base (you + friends), so no need for anything heavier.

---

## 3. Data Model (Supabase / Postgres)

```
users
  id (uuid, pk)
  email
  name
  current_photo_url
  height_cm, weight_kg, age
  created_at

gym_plans
  id (uuid, pk)
  user_id (fk)
  created_at
  source_type ('text' | 'pdf')
  raw_input (text)              -- original paste/PDF extract, kept for re-analysis
  status ('active' | 'archived')

exercises
  id (uuid, pk)
  plan_id (fk)
  name                            -- e.g. "Bench Press"
  muscle_group                    -- e.g. "Chest/Triceps"
  alternates (jsonb)              -- ["Incline DB Press", "Push-ups"]
  current_target (jsonb)          -- { weight_kg, reps, sets }
  overload_rule (jsonb)           -- { type: 'weight_then_reps', weight_increment, rep_increment, reps_threshold }
  history (jsonb)                 -- [{ date, weight_kg, reps_done, sets_done, notes }]
  last_updated_by ('gemini' | 'user')

workout_logs
  id (uuid, pk)
  exercise_id (fk)
  date
  weight_kg, reps_done, sets_done
  synced_offline (bool)           -- true if this came from the offline queue
  gemini_processed (bool)         -- has the overload check run on this entry yet
```

**Why JSONB for `history`/`current_target`/`overload_rule`:** each exercise's shape varies (some have alternates, some don't; overload rules differ per lift). JSONB keeps this flexible while staying in one queryable table — avoids the "exploding tables" problem from your notes.

---

## 4. Gemini Trigger Logic (your "combination" answer)

| Trigger | When | What Gemini does |
|---|---|---|
| **Event-driven** | Every new `workout_log` insert | Checks *only that exercise's* overload rule against the new log. Cheap, fast, single-exercise scope. |
| **Scheduled** | Weekly (cron via Supabase Edge Function or a simple cron job) | Reviews the whole plan's `history` across exercises — looks for plateaus, imbalance between muscle groups, suggests bigger changes. |
| **Manual** | "Re-analyze" button in UI | Same scope as scheduled review, triggered on demand. |

This means most app opens are just **reads from the DB** — no Gemini call needed unless one of the three triggers above fires. That answers your "when to update" worry directly.

### The actual overload decision (event-driven case)
This is the logic from your notes ("if can't increase weight, increase reps instead"). Encode it as a rule Gemini evaluates per log entry:

```
if reps_done >= current_target.reps for N consecutive sessions:
    → increase weight by overload_rule.weight_increment
    → reset reps to original target
else if weight_done == current_target.weight but reps_done < target:
    → hold weight, keep working toward rep target
else if user logs a stall for M sessions at same weight/reps:
    → increase reps by overload_rule.rep_increment instead of weight
    → (this is the "can't increase weight → increase reps" branch)
```

This pseudo-logic becomes part of the Gemini prompt for the event-driven trigger — it's evaluating a rule, not freely deciding, which keeps it predictable and avoids it doing something do unpredictable to your plan.

---

## 5. Offline Handling (the part you flagged as tricky)

**Your question:** *"if user increased reps but not weight while offline, how does Gemini know what to do when back online?"*

Answer: **Gemini never sees anything until it's synced.** The offline queue's only job is to hold raw logs faithfully — no analysis happens offline.

1. User logs a workout offline → saved to IndexedDB with a timestamp, marked `synced_offline: true`.
2. When connectivity returns → app pushes queued logs to Supabase **in timestamp order**, one at a time.
3. Each log triggers the event-driven Gemini check *after* it's safely in the DB — same logic as if it had been logged online, just delayed.
4. If multiple offline logs exist for the same exercise (e.g. 3 sessions logged offline over a week), Gemini processes them **in chronological order**, updating `current_target` step by step — so by the time it reaches the most recent one, it's reasoning off the correct, up-to-date target, not stale data.

This keeps the overload logic identical online vs offline — only the timing of when Gemini sees the data changes.

---

## 6. Build Phases

> Note: everything runs **locally** (`npm run dev`) through Phase 1–4. No Vercel deploy until Phase 5, once there's an actual app worth putting a URL on.

### Phase 1 — Scaffold + Landing Page
- Next.js app (App Router), Tailwind, basic project structure — **run locally only, no deploy yet**
- Supabase project created (cloud project, but app still runs local — Supabase itself is hosted regardless)
- Landing page: what the app is, a "Get Started" / "Log In" entry point — no real functionality behind it yet, just the shell
- Goal of this phase: a clean local dev environment + a landing page you're not embarrassed to look at

### Phase 2 — Auth + DB + Schema
- Supabase Auth wired up (signup/login/logout)
- Create all tables from Section 3 (`users`, `gym_plans`, `exercises`, `workout_logs`) directly in Supabase
- Protected route: logged-in users get redirected somewhere real, logged-out users bounce to landing/login
- At the end of this phase: you can create an account, log in, log out, and see (empty) tables in Supabase — no UI for the actual gym data yet

### Phase 3 — Onboarding Flow
- Form: paste plan text OR upload PDF, + height/weight/age + photo upload (Supabase Storage)
- Send to Gemini → parse into structured `exercises` rows
- Show user the parsed plan for confirmation/edit before saving
- At the end of this phase: a new user can go from "nothing" to "has a structured plan saved in the DB"

### Phase 4 — Main UI Dashboard
- Dashboard: photo + gym plan overview
- Click into an exercise → see current target, history, alternates
- Log workout form (weight/reps/sets done today)
- At the end of this phase: the app is actually usable end-to-end, still local-only

### Phase 5 — Deploy + Gemini Live Logic
- **First Vercel deploy** — now that there's a real app behind it
- Connect Vercel to Supabase (env vars, etc.)
- Event-driven Gemini check on new log → update `current_target` per overload rule
- "Re-analyze" manual button
- Weekly scheduled review (Supabase Edge Function or simple cron)

### Phase 6 — PWA + Offline
- `manifest.json`, icons, service worker
- IndexedDB queue for offline logs
- Sync-on-reconnect logic (Section 5)
- This is the phase where "Add to Home Screen" actually starts working properly

### Phase 7 — Polish
- Loading states, error handling, mobile UI pass

---

## 7. Open Decisions to Revisit
- Exact wording/constraints for the Gemini parsing prompt (Phase 3) — will need iteration once you see real outputs
- How many consecutive sessions (`N`/`M` in Section 4) before triggering an overload change — start with a guess (e.g. 2–3), tune from real use
- Whether "alternates" are ever auto-swapped in, or just shown as suggestions (recommend: just shown, user swaps manually for now)