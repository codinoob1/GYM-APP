'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkout } from '@/lib/WorkoutContext';
import ExerciseTabSwitcher from '@/components/exercise/ExerciseTabSwitcher';
import CurrentTargetCard from '@/components/exercise/CurrentTargetCard';
import AlternatesList from '@/components/exercise/AlternatesList';
import WeightChart from '@/components/exercise/WeightChart';
import SessionHistory from '@/components/exercise/SessionHistory';
import { Button } from '@/components/ui/Button';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { parsedPlan, workoutLogs } = useWorkout();
  const exerciseName = decodeURIComponent(params.id);

  const allExercises = useMemo(() => {
    if (!parsedPlan) return [];
    return parsedPlan.flatMap((day) =>
      day.exercises.map((ex) => ({ ...ex, day: day.day, category: day.category }))
    );
  }, [parsedPlan]);

  const categoryExercises = useMemo(() => {
    const current = allExercises.find((ex) => ex.name === exerciseName);
    if (!current) return [];
    return allExercises.filter((ex) => ex.category === current.category);
  }, [allExercises, exerciseName]);

  const activeIndex = categoryExercises.findIndex((ex) => ex.name === exerciseName);
  const currentExercise = categoryExercises[activeIndex] || allExercises.find((ex) => ex.name === exerciseName);

  const exerciseLogs = useMemo(() => {
    if (!workoutLogs || !currentExercise) return [];
    return workoutLogs
      .filter((log) => log.exerciseId === currentExercise.name)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-20);
  }, [workoutLogs, currentExercise]);

  const chartData = useMemo(() => {
    return exerciseLogs.map((log) => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight_kg,
    }));
  }, [exerciseLogs]);

  if (!currentExercise) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <p className="text-[#8b8d98] text-sm">Exercise not found.</p>
        <Button variant="secondary" onClick={() => router.push('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-[#8b8d98] hover:text-white transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-mono">
            {currentExercise.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">{currentExercise.name}</h1>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/logging/${currentExercise.category.toLowerCase().replace(/[^a-z]+/g, '-')}`)}
        >
          Log
        </Button>
      </div>

      <ExerciseTabSwitcher
        exercises={categoryExercises}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onSwitch={(i) => router.push(`/exercise/${encodeURIComponent(categoryExercises[i]?.name || '')}`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CurrentTargetCard exercise={currentExercise} />
          <AlternatesList alternates={currentExercise.alternates} />
        </div>
        <div className="space-y-6">
          <WeightChart data={chartData} />
          <SessionHistory logs={exerciseLogs} />
        </div>
      </div>
    </div>
  );
}
