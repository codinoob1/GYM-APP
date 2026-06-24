# design.md — Visual Design System + Phase 1 (Landing Page)

This file is the design source of truth. Any agent building UI should match this exactly — don't invent new colors, fonts, or layout patterns. If something needed isn't covered here, ask before guessing.

---

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `bg-primary` | `#0a0a0f` | Page background |
| `bg-card` | `#13141a` | Card/panel background |
| `accent` | `#c4f135` | Primary buttons, active nav state, highlights |
| `text-primary` | `#ffffff` / off-white | Headings, primary text |
| `text-secondary` | `#8b8d98` | Labels, muted text |
| `muscle-chest` | green | Chest/Triceps tag color |
| `muscle-back` | blue | Back/Biceps tag color |
| `muscle-legs` | purple | Legs/Core tag color |
| `muscle-shoulders` | orange | Shoulders tag color |

### Typography
- **Headings**: bold, condensed/impact sans-serif. Big, confident, sometimes multi-line with one line in accent color (see landing page hero below).
- **Body/UI text**: clean sans-serif (Inter or similar).
- **Metadata labels** (e.g. WEIGHT, REPS, STREAK): uppercase, monospace, small, letter-spaced, `text-secondary` color.
- **Big stat numbers**: large, bold, colored (accent or muscle-group color).

### Components
- **Primary button**: `accent` fill, dark text, rounded corners (~8px)
- **Secondary button**: dark fill, subtle border/outline, white text
- **Card**: `bg-card` fill, rounded corners (~8px), padding 16–24px, subtle border
- **Badge/pill**: small rounded background tag (e.g. "POWERED BY GEMINI AI", "AI PARSED")

### Layout
- **Desktop**: left sidebar nav (Dashboard / Progress / Profile), avatar + name pinned at sidebar bottom
- **Mobile** (not yet designed in Figma — flag before assuming): sidebar becomes bottom tab bar, multi-column grids collapse to single column
- Spacing: generous whitespace, content doesn't crowd edges, dark background does a lot of the visual work — avoid clutter

---

## Phase 1: Landing Page

**Goal:** static, no auth, no backend calls — just the marketing/entry screen.

### Structure (top to bottom)
1. **Nav bar**: logo (icon + "GYM TRACKER AI" wordmark, accent-colored icon) on left, "Log In" button (secondary style) on right
2. **Hero section** (two-column on desktop, stacks on mobile):
   - Left column:
     - Small pill badge: "⚡ POWERED BY GEMINI AI"
     - Large heading, 3 lines: "YOUR PLAN." / "SMARTER" (accent color) / "EVERY WEEK."
     - Subtext (1 short paragraph): explain the core loop — paste your plan, AI structures it, tracks sessions, applies progressive overload automatically
     - Two buttons side by side: "Get Started Free →" (primary/accent) and "Log In" (secondary)
   - Right column:
     - A card mockup preview: "TODAY'S SESSION" header with a muscle-group badge, list of 2-3 exercises showing weight×reps and a "prev: Xkg" comparison, a "Log Today's Workout" button at the bottom of the card
3. **Feature row** (3 columns, stacks on mobile): each with a small icon, bold short title, one-line description
   - "Paste or Upload Your Plan" — supports free-text or PDF, AI structures it automatically
   - "Progressive Overload, Automated" — Gemini tracks history and tells you when to add weight
   - "Visual Progress Over Time" — see strength trends per exercise across every session

### What NOT to build in this phase
- No real auth (Log In button can be non-functional or link to a placeholder route)
- No data fetching, no Supabase calls
- No onboarding flow yet — that's Phase 3

### Responsive behavior for this screen
- Desktop: two-column hero as described
- Mobile: hero stacks vertically — heading + subtext + buttons first, then the session-preview card below, then feature row stacks to single column
- No mobile Figma frame exists for this yet — use your best judgment matching the design tokens above, but flag it as a guess, not a finished spec

---

## Reference
Full data model, Gemini trigger rules, and overall build order live in `AGENTS.md` / `gym-tracker-spec.md` in this same folder.