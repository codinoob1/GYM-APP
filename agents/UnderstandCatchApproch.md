# Cache-First Approach — Gym Tracker App

## What Is It

The dashboard should never call the database on every page refresh or re-render.
Instead, the plan data is stored locally on the user's device after the first fetch.
Every subsequent visit reads from that local storage instead of hitting Supabase.

---

## The Rule

> Only call the database when there is no local data, or when the user explicitly asks for a refresh.

---

## When the Database Gets Called

There are only two moments when Supabase is contacted for the workout plan:

1. **First time after onboarding** — the user just confirmed their plan. It gets saved to Supabase and immediately also saved to the local device cache. The dashboard never needs to fetch it separately.

2. **User clicks "Re-analyse"** — the user intentionally wants a fresh copy. The old cache is wiped, a new call is made to Supabase, and the result is saved back to cache again.

That is it. Those are the only two moments.

---

## Every Other Time (All Refreshes, All Re-renders)

The dashboard checks local storage first.

- If data is there → use it, render immediately, do not touch the database.
- If data is not there → fall back to fetching from Supabase, then save to cache.

---

## Why This Matters

- The database does not get hammered with reads every time the user opens the app.
- The dashboard loads instantly from local cache instead of waiting for a network round trip.
- Supabase is treated as the source of truth, but local storage is the performance layer in front of it.

---

## What Clears the Cache

Only one thing clears the cache intentionally — the "Re-analyse" button.

If the user clears their browser storage manually, or opens the app on a new device,
the cache will simply be empty and the app falls back to fetching from Supabase automatically.
This is handled gracefully — no errors, no special cases needed.

---

## What Is Never Cached

- User authentication state — Supabase handles that separately.
- Profile info (age, weight, height, goal) — only the parsed workout plan is cached.
- Any real-time updates or edits the user makes — those go straight to Supabase and then update the cache.

---

## Summary in One Sentence

Read from local storage first, write to local storage after every DB fetch, and only go to the database when the cache is empty or the user forces a refresh.