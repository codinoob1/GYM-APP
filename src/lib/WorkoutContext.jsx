"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { supabase } from "./supabaseClient";

const defaultData = {
  userProfile: null,
  parsedPlan: null,
  rawPlanText: "",
  workoutLogs: [],
  coachNotes: {},
};

const WorkoutContext = createContext(null);

// Normalize profile from DB (training_since → trainingSince, primary_goal → goal)
function normalizeProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    trainingSince: profile.trainingSince ?? profile.training_since ?? "",
    goal: profile.goal ?? profile.primary_goal ?? "",
    photo_url: profile.photo_url ?? "",
    photoPreview: profile.photoPreview ?? profile.photo_url ?? "",
  };
}

// Map context profile shape → DB columns
function profileToDb(profile) {
  if (!profile) return {};
  return {
    name: profile.name ?? "",
    age: profile.age ?? null,
    weight: profile.weight ?? null,
    height: profile.height ?? null,
    training_since: profile.trainingSince ?? profile.training_since ?? null,
    primary_goal: profile.goal ?? profile.primary_goal ?? null,
    photo_url: profile.photo_url ?? null,
  };
}

// Map context log shape → DB columns
function logToDb(log, userId) {
  return {
    id: log.id,
    user_id: userId,
    exercise_name: log.exerciseId ?? log.exercise_name ?? null,
    date: log.date ?? new Date().toISOString().split("T")[0],
    weight_kg: log.weight_kg ?? null,
    reps_done: log.reps_done ?? null,
    sets_done: log.sets_done ?? null,
    notes: log.notes ?? null,
  };
}

export function WorkoutProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const initDone = useRef(false);

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) {
      setLoaded(true);
      return;
    }
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: plan } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { data: logs } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      setData((prev) => ({
        ...prev,
        userProfile: normalizeProfile(profile || null),
        parsedPlan: plan?.parsed_json || null,
        rawPlanText: plan?.raw_text || "",
        workoutLogs: logs || [],
        coachNotes: prev.coachNotes || {},
      }));
      // persist server-fetched state to local cache for offline/PWA use
      try {
        if (typeof window !== 'undefined') {
          const key = `gym-tracker-cache:${userId}`;
          localStorage.setItem(
            key,
            JSON.stringify({
              userProfile: normalizeProfile(profile || null),
              parsedPlan: plan?.parsed_json || null,
              rawPlanText: plan?.raw_text || "",
              workoutLogs: logs || [],
              savedAt: Date.now(),
            }),
          );
        }
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    (async () => {
      let canceled = false;
      try {
        const res = await fetch("/api/user-data");
        if (res.ok) {
          const json = await res.json();
          if (canceled) return;
          setUser(json.user ?? null);
          // merge with any local cached unsynced logs for the same user
          let mergedLogs = json.logs ?? [];
          try {
            if (typeof window !== 'undefined') {
              const key = `gym-tracker-cache:${json.user?.id || 'anon'}`;
              const raw = localStorage.getItem(key);
              if (raw) {
                const local = JSON.parse(raw);
                if (local?.workoutLogs?.length) {
                  const existingIds = new Set(mergedLogs.map((l) => l.id));
                  local.workoutLogs.forEach((l) => {
                    if (!existingIds.has(l.id)) mergedLogs.push(l);
                  });
                }
              }
            }
          } catch (e) {
            console.error('Failed to read local cache during init', e);
          }

          setData((prev) => ({
            ...prev,
            userProfile: normalizeProfile(json.profile ?? null),
            parsedPlan: json.plan?.parsed_json ?? null,
            rawPlanText: json.plan?.raw_text ?? "",
            workoutLogs: mergedLogs,
            coachNotes: prev.coachNotes || {},
          }));
          setLoaded(true);
          return;
        }
      } catch (e) {
        console.error("Server user-data fetch failed:", e);
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          fetchUserProfile(session.user.id);
        } else {
          setLoaded(true);
        }
      } catch (e) {
        setLoaded(true);
      }

      return () => { canceled = true; };
    })();
  }, [fetchUserProfile]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setData(defaultData);
        setLoaded(true);
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchUserProfile]);

  // Persist context to localStorage for offline/PWA resilience once hydration has finished
  useEffect(() => {
    if (!loaded) return;

    try {
      if (typeof window === 'undefined') return;
      const key = `gym-tracker-cache:${user?.id || 'anon'}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          userProfile: data.userProfile,
          parsedPlan: data.parsedPlan,
          rawPlanText: data.rawPlanText,
          workoutLogs: data.workoutLogs,
          coachNotes: data.coachNotes,
          savedAt: Date.now(),
        }),
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [data, user, loaded]);

  const updateProfile = useCallback(
    async (profile) => {
      if (!user) return;
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...profileToDb(profile),
      });
      if (!error) {
        setData((prev) => ({
          ...prev,
          userProfile: normalizeProfile({ ...prev.userProfile, ...profile }),
        }));
      }
    },
    [user],
  );

  const saveOnboarding = useCallback(
    async (profile, plan, rawText) => {
      if (!user) return;

      await supabase.from("profiles").upsert({
        id: user.id,
        ...profileToDb(profile),
      });

      await supabase.from("workout_plans").upsert({
        user_id: user.id,
        raw_text: rawText || "",
        parsed_json: plan,
      });

      setData({
        userProfile: normalizeProfile(profile),
        parsedPlan: plan,
        rawPlanText: rawText || "",
        workoutLogs: [],
        coachNotes: {},
      });
    },
    [user],
  );

  const addWorkoutLog = useCallback(
    async (logs) => {
      // Offline-first: update context and local cache only. DB writes happen via `syncToDb`.
      const localLogs = logs.map((log) => ({
        id:
          log.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
        exerciseId: log.exerciseId ?? log.exercise_id ?? log.exercise_name ?? null,
        date: log.date,
        weight_kg: log.weight_kg,
        reps_done: log.reps_done,
        sets_done: log.sets_done,
        notes: log.notes ?? null,
        user_id: user?.id ?? null,
        synced: false,
      }));

      setData((prev) => ({
        ...prev,
        workoutLogs: [...(prev.workoutLogs || []), ...localLogs],
      }));

      try {
        if (typeof window !== 'undefined') {
          const key = `gym-tracker-cache:${user?.id || 'anon'}`;
          const raw = localStorage.getItem(key);
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.workoutLogs = [...(parsed.workoutLogs || []), ...localLogs];
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore storage errors
      }
    },
    [user],
  );

  const reanalyzePlan = useCallback(
    async (plan) => {
      if (!user) return;
      await supabase.from("workout_plans").upsert({
        user_id: user.id,
        raw_text: data.rawPlanText,
        parsed_json: plan,
      });
      setData((prev) => ({ ...prev, parsedPlan: plan }));
    },
    [user, data.rawPlanText],
  );

  const syncToDb = useCallback(async () => {
    if (!user) throw new Error("Not logged in");

    const promises = [];

    if (data.userProfile) {
      promises.push(
        supabase.from("profiles").upsert({
          id: user.id,
          ...profileToDb(data.userProfile),
        }),
      );
    }

    if (data.parsedPlan) {
      promises.push(
        supabase.from("workout_plans").upsert({
          user_id: user.id,
          raw_text: data.rawPlanText || "",
          parsed_json: data.parsedPlan,
        }),
      );
    }

    const pendingLogs = data.workoutLogs.filter((log) => log.synced === false);
    if (pendingLogs.length > 0) {
      promises.push(
        supabase
          .from("workout_logs")
          .upsert(pendingLogs.map((log) => logToDb(log, user.id)), {
            onConflict: "id",
          }),
      );
    }

    const results = await Promise.all(promises);
    const failedResult = results.find((result) => result?.error);
    if (failedResult) {
      throw new Error(failedResult.error.message || "Failed to sync to Supabase");
    }

    if (pendingLogs.length > 0) {
      setData((prev) => ({
        ...prev,
        workoutLogs: prev.workoutLogs.map((log) =>
          log.synced === false ? { ...log, synced: true } : log,
        ),
      }));
    }
  }, [user, data]);

  const clearData = useCallback(async () => {
    await supabase.auth.signOut();
    setData(defaultData);
    setUser(null);
  }, []);

  const getWorkoutCount = () => {
    if (!data.workoutLogs?.length) return 0;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const uniqueDays = new Set();
    data.workoutLogs.forEach((log) => {
      const d = new Date(log.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        uniqueDays.add(d.toDateString());
      }
    });
    return uniqueDays.size;
  };

  const getVolume = () => {
    if (!data.workoutLogs?.length) return 0;
    return data.workoutLogs.reduce((sum, log) => {
      return (
        sum + (log.weight_kg || 0) * (log.reps_done || 0) * (log.sets_done || 0)
      );
    }, 0);
  };

  return (
    <WorkoutContext.Provider
      value={{
        ...data,
        loaded,
        user,
        setData,
        updateProfile,
        saveOnboarding,
        addWorkoutLog,
        reanalyzePlan,
        syncToDb,
        clearData,
        getWorkoutCount,
        getVolume,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}