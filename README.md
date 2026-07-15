# Gym Tracker AI

An AI-powered gym tracking PWA. Paste your existing workout plan, let Gemini parse it into a structured plan, log your sessions, and track progressive overload over time — all from your phone's home screen.

**Live demo:** https://myfitness-topaz.vercel.app

![Dashboard](./screenshots/dashboard.png)

---

## Features

- Paste your workout plan as text or upload a PDF — Gemini structures it automatically
- Session-by-session workout logging with weight/reps/sets steppers
- Progressive overload tracking with weight-over-time charts
- AI Coach notes per exercise based on your actual logged data
- Installable as a PWA — works like a native app on iPhone and Android
- Offline-first — logs save locally, sync to DB when you're ready
- Before/after progress photo comparison
- Strength progress tracking across all exercises

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini API |
| PWA | next-pwa |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) account for the Gemini API key
- A [Google Cloud Console](https://console.cloud.google.com) project if you want Google OAuth

### 1. Clone the repo

```bash
git clone https://github.com/codinoob1/GYM-APP.git
cd GYM-APP
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth (optional — only needed if you want "Continue with Google")
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Where to find these:**

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase dashboard → Project Settings → API
- `GEMINI_API_KEY` → [Google AI Studio](https://aistudio.google.com) → Get API Key → Create API Key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` → Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID

> ⚠️ Never commit `.env.local` to Git. It's already in `.gitignore` — keep it that way.

### 3. Set up the Supabase database

Go to your Supabase project → SQL Editor → run the following:

```sql
-- Profiles table
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  age int,
  weight numeric,
  height numeric,
  training_since int,
  primary_goal text,
  photo_url text,
  created_at timestamp default now()
);
alter table profiles enable row level security;

create policy "Users can insert their own profile"
on profiles for insert with check (auth.uid() = id);

create policy "Users can read their own profile"
on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update using (auth.uid() = id);

-- Workout plans table
create table if not exists workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  raw_text text,
  parsed_json jsonb,
  created_at timestamp default now()
);
alter table workout_plans enable row level security;

create policy "Users can insert their own plan"
on workout_plans for insert with check (auth.uid() = user_id);

create policy "Users can read their own plan"
on workout_plans for select using (auth.uid() = user_id);

create policy "Users can update their own plan"
on workout_plans for update using (auth.uid() = user_id);

-- Workout logs table
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  exercise_name text,
  date date default current_date,
  weight_kg numeric,
  reps_done int,
  sets_done int,
  notes text,
  created_at timestamp default now()
);
alter table workout_logs enable row level security;

create policy "Users can insert own logs"
on workout_logs for insert with check (auth.uid() = user_id);

create policy "Users can read own logs"
on workout_logs for select using (auth.uid() = user_id);

create policy "Users can update own logs"
on workout_logs for update using (auth.uid() = user_id);

-- Storage policies for progress photos
create policy "Users can upload their own photo"
on storage.objects for insert
with check (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public photo access"
on storage.objects for select using (bucket_id = 'photos');
```

### 4. Create the photos storage bucket

Supabase dashboard → Storage → New Bucket → name it `photos` → set to **Public**.

### 5. Configure Supabase Auth

Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000` (for local) or your Vercel URL (for production)
- **Redirect URLs**: add both `http://localhost:3000/**` and your Vercel URL + `/**`

If using Google OAuth, also add your Google Client ID and Secret in Supabase → Authentication → Providers → Google.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel → Settings → Environment Variables
4. Deploy
5. Update Supabase Auth → Site URL to your new Vercel URL

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          — login + signup pages
│   ├── (app)/
│   │   ├── dashboard/   — main dashboard
│   │   ├── exercise/    — exercise detail + history
│   │   ├── logging/     — workout logging flow
│   │   ├── progress/    — photos + strength progress
│   │   └── profile/     — profile + save to DB + re-analyze
│   ├── api/             — server-side API routes
│   └── onboarding/      — 4-step onboarding flow
├── components/          — UI components per feature
├── lib/
│   ├── supabaseClient.js
│   ├── supabaseServer.js
│   ├── WorkoutContext.jsx
│   └── geminiApi.js
└── agents/              — AI agent instruction files (AGENTS.md, design.md, etc.)
```

---

## Contributing

Contributions are welcome. This project was built solo in 3 weeks at 1hr/day — there's plenty of room to improve.

**To contribute:**

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Open a pull request with a clear description of what you changed and why

**Good first issues to work on:**
- Mobile UI polish (some screens need responsive work)
- Progress page charts (currently basic, could use better data visualization)
- Streak calculation logic
- Offline sync conflict handling (what happens if same exercise logged on two devices)
- Unit tests (Jest is set up but coverage is low)
- Dark/light theme toggle

**Before submitting a PR:**
- Read `agents/AGENTS.md` — it explains the architecture, data model, and rules
- Read `agents/clean-code.md` — coding conventions
- Don't add new Supabase calls inside component files — all DB access goes through `WorkoutContext.jsx` or API routes
- Test on mobile, not just desktop

**Please don't:**
- Refactor the entire codebase in one PR
- Add new dependencies without discussing first
- Change the DB schema without updating `AGENTS.md`

---

## Known Issues

- Progress photos tab is UI-only, upload not fully wired
- Weights show `—` if your original plan didn't include weights (enter them manually on first log)
- PWA on iOS requires "Add to Home Screen" from Safari — Chrome on iOS won't prompt correctly

---

## License

MIT — use it, fork it, build on it.

---

Built with 0 budget. Every tool in the stack has a free tier.
