'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkout } from '@/lib/WorkoutContext';
import LoggingHeader from '@/components/logging/LoggingHeader';
import ProgressDots from '@/components/logging/ProgressDots';
import TargetBanner from '@/components/logging/TargetBanner';
import ExerciseStepper from '@/components/logging/ExerciseStepper';
import { Button } from '@/components/ui/Button';

export default function LoggingPage() {
  const params = useParams();
  const router = useRouter();
  const { parsedPlan, addWorkoutLog } = useWorkout();

  const categorySlug = decodeURIComponent(params.category);

  const categoryExercises = useMemo(() => {
    if (!parsedPlan) return [];
    for (const day of parsedPlan) {
      const slug = day.category.toLowerCase().replace(/[^a-z]+/g, '-');
      if (slug === categorySlug) return day.exercises;
    }
    return [];
  }, [parsedPlan, categorySlug]);

  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);

  const currentEx = categoryExercises[step];
  const isLast = step === categoryExercises.length - 1;

  const [weight, setWeight] = useState(currentEx?.weight ?? 0);
  const [reps, setReps] = useState(currentEx?.reps ?? 0);
  const [sets, setSets] = useState(currentEx?.sets ?? 0);

  const handleSaveAndNext = () => {
    const entry = {
      exerciseId: currentEx.name,
      date: new Date().toISOString(),
      weight_kg: weight,
      reps_done: reps,
      sets_done: sets,
    };
    const updatedLogs = [...logs, entry];

    if (isLast) {
      addWorkoutLog(updatedLogs);
      router.push('/dashboard');
    } else {
      setLogs(updatedLogs);
      const next = categoryExercises[step + 1];
      setStep(step + 1);
      setWeight(next?.weight ?? 0);
      setReps(next?.reps ?? 0);
      setSets(next?.sets ?? 0);
    }
  };

  if (categoryExercises.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-[#8b8d98] text-sm">No exercises found for this category.</p>
        <Button variant="secondary" onClick={() => router.push('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <LoggingHeader
        category={categoryExercises[0]?.category || categorySlug}
        exerciseName={currentEx?.name || ''}
        current={step + 1}
        total={categoryExercises.length}
        onExit={() => router.push('/dashboard')}
      />

      <ProgressDots total={categoryExercises.length} current={step} />

      <TargetBanner exercise={currentEx} />

      <div className="flex gap-4">
        <ExerciseStepper label="Weight" value={weight} unit="kg" onChange={setWeight} min={0} />
        <ExerciseStepper label="Reps" value={reps} unit="reps" onChange={setReps} min={1} />
        <ExerciseStepper label="Sets" value={sets} unit="sets" onChange={setSets} min={1} />
      </div>

      <Button variant="primary" className="w-full justify-center" onClick={handleSaveAndNext}>
        {isLast ? 'Finish Workout' : 'Save & Next →'}
      </Button>
    </div>
  );
}
