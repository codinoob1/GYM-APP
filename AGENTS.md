# Gym Tracker AI — Agent Instructions

This file tells any AI coding agent (Copilot, Gemini CLI, Claude, OpenCode, etc.) how to work on this project. Read this before generating any UI or backend code.

---

## Project Summary

A gym-tracking PWA. User provides their current workout plan (pasted text or PDF) + basic stats + a photo. Gemini parses it into a structured plan and manages progressive overload over time as the user logs workouts. Built with Next.js (App Router) + Tailwind + Supabase + Gemini API. Solo developer, 1hr/day, free-tier tooling only — keep solutions simple and avoid unnecessary dependencies.

---

## Design System (already established in Figma — match this exactly, do not invent a new style)

### Colors
- Background: near-black, `#0a0a0f`
- Card background: dark gray, `#13141a` (slightly lighter than page background)
- Primary accent (buttons, active nav, highlights): lime/yellow-green, `#c4f135`
- Text primary: white / off-white
- Text secondary: muted gray, `#8b8d98`
- Muscle-group color coding (used consistently as small dot/badge indicators):
  - Chest/Triceps → green
  - Back/Biceps → blue
  - Legs/Core → purple
  - Shoulders → orange

### Typography
- Headings: bold, condensed/impact-style sans-serif (e.g. a tight grotesk font), used for big statements like "GOOD MORNING, JAMIE."
- Body/UI text: clean sans-serif (Inter or similar)
- Metadata labels (WEIGHT, REPS, SETS, CURRENT TARGET, SESSION HISTORY): uppercase, monospace, small size, letter-spaced, muted gray
- Big numeric stats (weight/reps/sets values): large, bold, colored with the accent or muscle-group color

### Layout patterns
- Desktop: left sidebar nav (Dashboard / Progress / Profile) + user avatar/name pinned at bottom of sidebar
- Cards: rounded corners (~8px), dark fill, subtle border, generous internal padding
- Dashboard: stat row (workouts/volume/streak) → big "Log Today's Workout" CTA banner → grid of day-cards for the week's plan
- Exercise detail: tab-style exercise switcher at top, big "current target" numbers, AI Coach tip banner (colored to match muscle group, lightning-bolt icon), alternates list, weight-over-time chart + session history list on the right
- Onboarding: 4-step wizard with step indicator breadcrumb (Basic Info → Photo → Your Plan → Review), back/continue buttons, lime continue button

### Components to reuse everywhere (don't recreate variants)
- Primary button: lime fill, dark text, rounded
- Secondary/back button: dark fill, outline, white text
- Card: dark gray fill, rounded, padding ~16-24px
- Badge/pill: small rounded background, used for status tags ("AI PARSED", "POWERED BY GEMINI AI")

**Mobile breakpoint note:** the Figma file currently only has desktop frames designed. When building responsive layouts, the sidebar nav becomes a bottom tab bar on mobile, and multi-column grids collapse to single column. If a mobile Figma frame doesn't exist yet for a screen, ask before assuming — don't silently invent mobile layout decisions for screens that haven't been designed yet.

---

## Data Model (do not change without updating this file)

```
users           — id, email, name, current_photo_url, height_cm, weight_kg, age, created_at
gym_plans       — id, user_id, created_at, source_type ('text'|'pdf'), raw_input, status
exercises       — id, plan_id, name, muscle_group, alternates (jsonb), current_target (jsonb),
                   overload_rule (jsonb), history (jsonb), last_updated_by
workout_logs    — id, exercise_id, date, weight_kg, reps_done, sets_done, synced_offline, gemini_processed
```

JSONB is used for `alternates`, `current_target`, `overload_rule`, and `history` because exercise shapes vary — don't normalize these into separate tables unless asked.

---

## Gemini Trigger Rules (don't call Gemini more than this)

- **Event-driven**: on each new `workout_log` insert, check only that exercise's overload rule
- **Scheduled**: weekly full-plan review
- **Manual**: "Re-analyze" button

Never call Gemini on every page load. Most reads should hit Supabase directly.

---

## Build Order (current phase — check with the user before skipping ahead)

1. Scaffold + Landing Page (local only, no deploy)
2. Auth + DB + Schema
3. Onboarding Flow
4. Main UI Dashboard
5. Deploy (first Vercel push) + live Gemini logic
6. PWA + Offline support
7. Polish

---

## Rules for All Agents

- Match the design system above exactly — don't introduce new colors, fonts, or layout patterns without flagging it first
- Keep dependencies minimal — this is a free-tier, low-budget build
- Don't restructure the data model without explicit approval
- Work one phase at a time — don't jump ahead to later phases unprompted
- If something in the Figma design isn't covered here (e.g. a missing mobile layout), ask rather than guessing