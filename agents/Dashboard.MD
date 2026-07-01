# ui-spec.md — Full UI & File Structure Spec

All screens designed and confirmed. Agents build against this file. Match the screenshots exactly — do not invent new patterns. Reference `design.md` for tokens and `clean-code.md` for file/folder conventions.

---

## File Structure (updated to match current UI)

```
src/app/
├── page.js                          — Landing page
├── (auth)/
│   ├── login/page.js
│   └── signup/page.js
├── onboarding/
│   ├── page.js                      — Step 1: Basic Info
│   ├── photo/page.js                — Step 2: Photo upload
│   ├── plan/page.js                 — Step 3: Paste text / upload PDF
│   └── review/page.js              — Step 4: Review parsed plan + confirm
├── dashboard/
│   └── page.js                      — Main dashboard (greeting, stats, plan grid)
├── exercise/
│   └── [id]/
│       └── page.js                  — Exercise detail (current target, AI coach, history, chart)
├── logging/
│   └── [category]/
│       └── page.js                  — Exercise-by-exercise logging flow
├── progress/
│   └── page.js                      — Progress page (Photos tab + Strength tab)
└── profile/
    └── page.js                      — Profile + Re-analyze button

src/components/
├── ui/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   └── StatCard.jsx
├── dashboard/
│   ├── GreetingHeader.jsx           — "GOOD MORNING, JAMIE." + next up
│   ├── StatsRow.jsx                 — Workouts / Volume / Streak cards
│   ├── LogTodayBanner.jsx           — Big lime CTA banner
│   └── PlanCard.jsx                 — Day card (Chest/Triceps, MON, exercise preview + delta)
├── exercise/
│   ├── ExerciseTabSwitcher.jsx      — Pill tabs (Bench Press / Incline DB Press / etc)
│   ├── CurrentTargetCard.jsx        — WEIGHT / REPS / SETS display + AI Coach banner
│   ├── AlternatesList.jsx
│   ├── WeightChart.jsx              — Weight over time line chart
│   └── SessionHistory.jsx           — SESSION HISTORY list (date + weight×reps)
├── logging/
│   ├── LoggingHeader.jsx            — "LOGGING · CHEST / TRICEPS" + exercise name + X/Y counter
│   ├── ExerciseStepper.jsx          — WEIGHT / REPS / SETS with − and + controls
│   ├── ProgressDots.jsx             — Dot indicators showing current exercise in session
│   └── TargetBanner.jsx             — "TARGET: 80kg × 8 × 4sets" bar
├── progress/
│   ├── ProgressStatsRow.jsx         — Start Weight / Current Weight / Sessions / Volume
│   ├── PhotosTab.jsx                — Before/After compare + timeline pills + All Photos grid
│   └── StrengthTab.jsx              — Key Lifts list (start → now + delta) + Weekly Volume chart
└── layout/
    ├── Sidebar.jsx                  — Desktop sidebar nav
    └── BottomNav.jsx                — Mobile bottom tab bar
```

---

## Screen 1 — Dashboard (`/dashboard`)

**Header:** day of week + "WEEK X" in muted uppercase → bold large heading "GOOD MORNING, [NAME]." (name in lime) → "Next up: [Category] — today" in muted text

**Stats row** (3 cards, equal width):
- WORKOUTS · big number · "this month"
- VOLUME · big number · "kg lifted"  
- STREAK · big number · "weeks"

**Log Today's Workout banner** (full width, lime fill):
- Left: lime icon circle + "Log Today's Workout" (bold) + "[Category] · X exercises" (muted, smaller)
- Right: → arrow
- Clicking this opens the logging flow for today's category

**YOUR PLAN section** (grid of day-cards, 4-up on desktop):
Each card (dark fill, rounded):
- Top row: muscle-group emoji icon (left) + day abbreviation (right, muted)
- Category name bold (e.g. "Chest / Triceps")
- "X exercises" muted
- Thin divider
- Main exercise name (e.g. "Bench Press") muted
- Weight bold + colored (lime for chest, blue for back, purple for legs, orange for shoulders) + "×reps"
- If overload triggered: small lime "↗ +2.5" delta badge inline
- Chevron → at bottom right
- Clicking a card opens `/exercise/[id]` for the first exercise in that category

---

## Screen 2 — Exercise Detail (`/exercise/[id]`)

**Top bar:** ← back arrow (left) + "CHEST / TRICEPS" breadcrumb (muted) above "BENCH PRESS" (bold, large) + "Log" button (lime, top right)

**Exercise tab switcher** (pill tabs, below header):
- One tab per exercise in the same category (e.g. Bench Press | Incline DB Press | Cable Tricep Pushdown)
- Active tab: lime border + lime text
- Inactive: dark border, muted text
- Clicking switches the content below without page navigation

**Left/main column:**

*Current Target card* (dark fill):
- "CURRENT TARGET" label (uppercase mono, muted)
- Three big numbers side by side: WEIGHT · REPS · SETS (each label below in muted mono)
- Numbers colored: lime for weight, blue-ish for reps, blue-ish for sets
- AI Coach banner below (dark olive/green fill, lightning bolt icon, lime "AI Coach:" label):
  - Text: e.g. "You've hit this weight 3 sessions in a row. Try +2.5kg next session."
  - Only shown when `coach_note` is not null in DB

*Alternates card* (dark fill):
- "ALTERNATES" label (uppercase mono, muted)
- List of alternate exercise names, each with a → chevron on the right, thin dividers between

**Right column:**

*Weight Over Time chart* (dark fill card):
- "WEIGHT OVER TIME" label (uppercase mono, muted)
- Line chart, lime colored line, dates on x-axis, weight on y-axis
- Use recharts or similar

*Session History* (dark fill card):
- "SESSION HISTORY" label (uppercase mono, muted)
- List: date on left (e.g. "Jun 9") · "Xkg × Y" on right (bold white), thin dividers

---

## Screen 3 — Logging Flow (`/logging/[category]`)

This is a sequential per-exercise logging screen. User goes through each exercise one at a time.

**Header:**
- X button top left (exits logging, goes back to dashboard)
- "LOGGING · CHEST / TRICEPS" (muted, uppercase) above "BENCH PRESS" (bold, large)
- "1/3" counter top right (current exercise / total exercises in session)

**Progress dots** (3 dots below header, one per exercise):
- Completed exercises: lime filled dot
- Current exercise: lime dot
- Upcoming: muted gray dot

**Target banner** (full width, muted dark fill):
- "◎ TARGET: 80kg × 8 × 4sets" — shows what the plan says to hit today

**Stepper controls** (3 cards side by side: WEIGHT / REPS / SETS):
- Each card: label (uppercase mono, muted) at top
- Large bold number in center
- − button left · + button right (dark rounded buttons)
- Unit label below number (kg / reps / sets)
- Pre-filled with `current_target` values from DB — user adjusts to what they actually did

**Notes field** (full width, dark fill, rounded):
- Placeholder: "Notes (optional) — e.g. form felt off, easy set..."

**Action button** (lime, full width, rounded):
- "Save & Next →" for all exercises except the last
- "Finish Workout" for the last exercise
- On "Finish Workout": saves all logged values to `workout_logs`, triggers overload check for each exercise, returns to dashboard

---

## Screen 4 — Progress Page (`/progress`)

**Header:** "X WEEKS · X SESSIONS" (muted, small) + "YOUR PROGRESS" (bold, large)

**Stats row** (4 cards, equal width):
- START WEIGHT · value · start date
- CURRENT WEIGHT · value · latest date
- SESSIONS LOGGED · count · "X weeks"
- TOTAL VOLUME · value in tonnes · "all time"

**Tab switcher:** "📷 Photos" | "💪 Strength" (pill style, same as exercise tabs)

---

### Photos Tab

**Compare section:**
- Two large side-by-side images (full bleed in their containers)
- "BEFORE" badge (dark pill, top left of before image)
- "AFTER" badge (lime pill, top right of after image)
- Below each image: timeline pill tabs (Start / Month 2 / Month 4 / Now) — active pill is lime
- Below pills: note card showing week number + the user's note for that checkpoint

**ALL PHOTOS grid** (4-up on desktop):
- Each tile: photo filling the frame, label at bottom left (e.g. "Start" / "Month 2") + weight below it
- Date below the tile in muted text
- Last tile: dashed border, camera icon + "Add Progress Photo" centered — opens photo upload

---

### Strength Tab

**KEY LIFTS — START VS NOW** (label, uppercase mono, muted):
List of exercise rows (dark fill cards, each):
- Exercise name (bold, left)
- "X kg → Y kg" (start muted, arrow, current bold white)
- Right: "+Z kg" in lime + "in X weeks" in muted below

**Weekly Volume chart** (below the list):
- "WEEKLY VOLUME (KG)" label (uppercase mono, muted)
- Area/line chart, lime line, y-axis in kg, x-axis in weeks

---

## Screen 5 — Onboarding Review (`/onboarding/review`) — already built, confirm spec

**Top:** step breadcrumb (all 4 steps) + progress bar full width + "Step 4 of 4 · Review" top right

**AI PARSED badge** (top right of content area, lime border + lightning bolt icon)

**Parsed plan** (grouped by day, each group in a dark card):
- Header row: colored dot + "Chest/Triceps" + "MONDAY" (muted, right)
- Each exercise: name bold + "4×8 @ 80kg" muted below, thin dividers

**Your Basic Info card** (bottom, dark fill, two columns):
- AGE · WEIGHT · HEIGHT · TRAINING SINCE · PRIMARY GOAL — each label muted mono, value bold

**Your Plan Input card** (bottom right, dark fill):
- Shows original pasted text (monospace, small)
- PHOTO STATUS label + "Photo selected" or "No photo"

**CTA:** "Confirm & Start Training" (lime, full width) — saves to DB → redirects to `/dashboard`

---

## Gemini Integration Points (where AI is called — do not add calls outside these)

| Trigger | Where | What it does |
|---|---|---|
| Onboarding Step 3 → 4 | `/onboarding/review` | Parses raw plan text → structured exercises JSON |
| "Finish Workout" tap | `/logging/[category]` | Per-exercise overload check → updates `current_target` + writes `coach_note` |
| "Re-analyze" button | `/profile` | Full plan review → can suggest plan-level changes |
| Weekly cron | Supabase Edge Function | Same as Re-analyze but automated |

Never call Gemini from the dashboard, exercise detail, or progress pages — those are DB reads only.

---

## Data displayed per screen (what to fetch from where)

| Screen | Data source |
|---|---|
| Dashboard | `exercises.current_target`, `workout_logs` (aggregate for stats/streak) |
| Exercise detail | `exercises` row (target, alternates, coach_note), `workout_logs` (history + chart) |
| Logging | `exercises.current_target` (pre-fill steppers), writes to `workout_logs` |
| Progress / Strength | `workout_logs` (all history), `exercises` (start vs current weight) |
| Progress / Photos | `users.progress_photos` (new JSONB field or separate table — see note below) |

**Note on progress photos:** add a `progress_photos` table:
```
progress_photos
  id, user_id, photo_url, weight_kg, note, taken_at, label ('Start'|'Month 2'|'Month 4'|'Now'|custom)
```

---

## Reference
Design tokens → `design.md` | Code conventions → `clean-code.md` | Architecture + phases → `gym-tracker-spec.md`