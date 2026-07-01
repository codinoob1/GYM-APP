'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gym-tracker-data';

const defaultData = {
  userProfile: null,
  parsedPlan: null,
  rawPlanText: '',
  workoutLogs: [],
};

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...defaultData, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  const persist = (next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const updateProfile = useCallback((profile) => {
    setData((prev) => {
      const next = { ...prev, userProfile: { ...prev.userProfile, ...profile } };
      persist(next);
      return next;
    });
  }, []);

  const saveOnboarding = useCallback((profile, plan, rawText) => {
    const next = {
      userProfile: profile,
      parsedPlan: plan,
      rawPlanText: rawText || '',
      workoutLogs: [],
    };
    persist(next);
  }, []);

  const addWorkoutLog = useCallback((logs) => {
    setData((prev) => {
      const next = {
        ...prev,
        workoutLogs: [...(prev.workoutLogs || []), ...logs],
      };
      persist(next);
      return next;
    });
  }, []);

  const reanalyzePlan = useCallback((plan) => {
    setData((prev) => {
      const next = { ...prev, parsedPlan: plan, workoutLogs: [] };
      persist(next);
      return next;
    });
  }, []);

  const clearData = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setData(defaultData);
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
      return sum + (log.weight_kg || 0) * (log.reps_done || 0) * (log.sets_done || 0);
    }, 0);
  };

  return (
    <WorkoutContext.Provider
      value={{
        ...data,
        loaded,
        updateProfile,
        saveOnboarding,
        addWorkoutLog,
        reanalyzePlan,
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
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
}
