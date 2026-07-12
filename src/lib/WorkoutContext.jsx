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
};

const WorkoutContext = createContext(null);

function normalizeProfile(profile) {
  if (!profile) return null;

  return {
    ...profile,
    trainingSince: profile.trainingSince ?? profile.training_since ?? '',
    goal: profile.goal ?? profile.primary_goal ?? '',
    photo_url: profile.photo_url ?? '',
    photoPreview: profile.photoPreview ?? profile.photo_url ?? '',
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

      setData({
        userProfile: normalizeProfile(profile || null),
        parsedPlan: plan?.parsed_json || null,
        rawPlanText: plan?.raw_text || "",
        workoutLogs: logs || [],
      });
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
      // Try server-side cookie-backed endpoint first (reliable in PWA/iOS)
      let canceled = false;
      try {
        const res = await fetch("/api/user-data");
        if (res.ok) {
          const json = await res.json();
          if (canceled) return;
          setUser(json.user ?? null);
          setData({
            userProfile: normalizeProfile(json.profile ?? null),
            parsedPlan: json.plan?.parsed_json ?? null,
            rawPlanText: json.plan?.raw_text ?? "",
            workoutLogs: json.logs ?? [],
          });
          setLoaded(true);
          return;
        }
      } catch (e) {
        console.error("Server user-data fetch failed:", e);
      }

      // Fallback: use client-side supabase session
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

  const updateProfile = useCallback(
    async (profile) => {
      if (!user) return;

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...profile,
      });
      if (!error) {
        setData((prev) => ({
          ...prev,
          userProfile: { ...prev.userProfile, ...profile },
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
        ...profile,
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
      });
    },
    [user],
  );

  const addWorkoutLog = useCallback(
    async (logs) => {
      if (!user) return;

      const logsWithUser = logs.map((log, index) => ({
        id: log.id ?? `${user.id}-${Date.now()}-${index}`,
        exercise_id: log.exerciseId,
        date: log.date,
        weight_kg: log.weight_kg,
        reps_done: log.reps_done,
        sets_done: log.sets_done,
        user_id: user.id,
        synced: true,
      }));

      const { error } = await supabase
        .from("workout_logs")
        .insert(logsWithUser);

      if (!error) {
        setData((prev) => ({
          ...prev,
          workoutLogs: [
            ...(prev.workoutLogs || []),
            ...logsWithUser.map((log) => ({
              ...log,
              exerciseId: log.exercise_id,
              synced: true,
            })),
          ],
        }));
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
      setData((prev) => ({ ...prev, parsedPlan: plan, workoutLogs: [] }));
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
          name: data.userProfile.name,
          age: data.userProfile.age,
          weight: data.userProfile.weight,
          height: data.userProfile.height,
          training_since: data.userProfile.trainingSince, // ← mapped
          primary_goal: data.userProfile.goal, // ← mapped
          photo_url: data.userProfile.photo_url,
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

    if (data.workoutLogs.length > 0) {
      const unsynced = data.workoutLogs.filter((log) => !log.synced);
      if (unsynced.length > 0) {
        promises.push(
          supabase.from("workout_logs").upsert(
            unsynced.map((log) => ({
              id: log.id,
              user_id: user.id,
              exercise_name: log.exerciseId ?? log.exercise_id,
              date: log.date,
              weight_kg: log.weight_kg,
              reps_done: log.reps_done,
              sets_done: log.sets_done,
              notes: log.notes ?? null,
            })),
            { onConflict: "id" },
          ),
        );
      }
    }

    const results = await Promise.all(promises);
    const failedResult = results.find((result) => result?.error);

    if (failedResult) {
      throw new Error(failedResult.error.message || "Failed to sync data to Supabase");
    }

    if (data.workoutLogs.length > 0) {
      setData((prev) => ({
        ...prev,
        workoutLogs: prev.workoutLogs.map((log) => ({
          ...log,
          synced: log.synced || !data.workoutLogs.some((item) => item.id === log.id && !item.synced),
        })),
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
