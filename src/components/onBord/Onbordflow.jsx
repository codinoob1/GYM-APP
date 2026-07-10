"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useWorkout } from "@/lib/WorkoutContext";
import { supabase } from "@/lib/supabaseClient";
import Basic from "./Basic";
import Photo from "./Photo";
import Plan from "./Plan";
import Review from "./Review";
import { getCachedData } from "@/lib/plancatch"

const steps = ["Basic Info", "Photo", "Your Plan", "Review"];

const initialFormData = {
  name: "",
  age: "28",
  weight: "82",
  height: "178",
  trainingSince: "2019",
  goal: "Hypertrophy",
  photo: null,
  photoPreview: "",
  photoError: "",
  planMode: "text",
  planText:
<<<<<<< HEAD
    "Monday - Chest/Triceps:\nBench Press: 4x8 @ 80kg\nIncline DB Press: 3x10 @ 28kg\nCable Tricep Pushdown: 3x12 @ 22.5kg",
  planFile: null,
=======
    "",  planFile: null,
>>>>>>> 4bce370 (Fixed from suggests from coderabbit)
  planFileName: "",
};

export default function Onbordflow() {
  const router = useRouter();
  const { saveOnboarding } = useWorkout();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [parsedPlan, setParsedPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoSelect = (payload, error) => {
    setFormData((current) => ({
      ...current,
      photo: payload?.file ?? null,
      photoPreview: payload?.preview ?? "",
      photoError: error || "",
    }));
  };

  const handlePlanFileChange = (file) => {
    if (!file) {
      updateField("planFile", null);
      updateField("planFileName", "");
      return;
    }
    if (file.type !== "application/pdf") {
      return;
    }
    updateField("planFile", file);
    updateField("planFileName", file.name);
  };

  const currentStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <Basic formData={formData} onFieldChange={updateField} />;
      case 1:
        return <Photo formData={formData} onPhotoSelect={handlePhotoSelect} />;
      case 2:
        return (
          <Plan
            formData={formData}
            onFieldChange={updateField}
            onPlanFileChange={handlePlanFileChange}
          />
        );
      case 3:
        return <Review formData={formData} onPlanParsed={setParsedPlan} />;
      default:
        return null;
    }
  };
  async function handleConfrim() {
    const profile = {
      name: formData.name || "",
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      trainingSince: formData.trainingSince,
      goal: formData.goal,
      photoPreview: formData.photoPreview || "",
    };
    const rawText = formData.planMode === "text" ? formData.planText : "[PDF]";

    getCachedData(parsedPlan);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

<<<<<<< HEAD
      await Promise.all([
        supabase.from("profiles").upsert({
          id: user.id,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          training_since: formData.trainingSince,
          primary_goal: formData.goal,
        }),
        supabase.from("workout_plans").upsert({
          user_id: user.id,
          raw_text: rawText,
          parsed_json: parsedPlan,
        }),
        supabase.auth.updateUser({
          data: { onboarding_completed: true },
        }),
      ]);
    } catch (e) {
      console.error("Supabase save failed (data cached locally):", e);
=======
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server onboarding save failed:", errorText);
        return;
      }

      await saveOnboarding(profile, parsedPlan, rawText);
      router.push("/dashboard");
    } catch (e) {
      console.error("Onboarding server save failed (data cached locally):", e);
    } finally {
      setSaving(false);
>>>>>>> 4bce370 (Fixed from suggests from coderabbit)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-[32px] border border-[#232630] bg-[#08090d] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#c4f135] text-black grid place-items-center font-bold">
                G
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8b8d98]">
                  Gym Tracker AI
                </p>
                <p className="text-sm text-[#8b8d98]">
                  Step {activeStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#6e7387]">{steps[activeStep]}</p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-full bg-[#11141f] h-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#c4f135] transition-all"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {steps.map((label, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <div
                  key={label}
                  className="flex items-center gap-3 text-sm font-medium text-[#8b8d98]"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#232630] ${isActive ? "bg-[#c4f135] text-black" : isCompleted ? "bg-[#1b2210] text-[#c4f135]" : "bg-[#11141f] text-[#6e7387]"}`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className={`${isActive ? "text-white" : ""}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-10">{currentStepComponent()}</div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              className={`${activeStep === 0 ? "invisible opacity-0 pointer-events-none" : ""}`}
              onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            >
              ‹ Back
            </Button>
            <Button
              variant="primary"
              className="min-w-[180px]"
              disabled={saving}
              onClick={async () => {
                if (activeStep == steps.length - 1) {
                  setSaving(true);
                  await handleConfrim();
                } else {
                  setActiveStep((step) => Math.min(steps.length - 1, step + 1));
                }
              }}
            >
              {saving
                ? "Saving..."
                : activeStep === steps.length - 1
                  ? "Finish"
                  : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
