"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { getCachedData } from "@/lib/plancatch";

const groupColorMap = {
  chest: "bg-[#c4f135]",
  triceps: "bg-[#c4f135]",
  back: "bg-cyan-400",
  biceps: "bg-cyan-400",
  legs: "bg-violet-400",
  core: "bg-violet-400",
  shoulders: "bg-orange-400",
};

function badgeColor(category) {
  const lower = category.toLowerCase();
  for (const [key, color] of Object.entries(groupColorMap)) {
    if (lower.includes(key)) return color;
  }
  return "bg-[#8b8d98]";
}

function formatDetails(exercise) {
  const weight = exercise.weight
    ? ` @ ${exercise.weight}${exercise.unit || "kg"}`
    : "";
  return `${exercise.sets}×${exercise.reps}${weight}`;
}

function LoadingSkeleton() {
  return (
    <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-6 space-y-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-[#181b23] bg-[#0f131d] p-5 animate-pulse"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#232630]">
            <div className="flex items-center gap-3">
              <div className="h-3.5 w-3.5 rounded-full bg-[#232630]" />
              <div className="h-4 w-32 rounded bg-[#232630]" />
            </div>
            <div className="h-3 w-16 rounded bg-[#232630]" />
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="rounded-2xl border border-[#1f2430] bg-[#11141f] p-4"
              >
                <div className="h-4 w-28 rounded bg-[#232630]" />
                <div className="h-3 w-20 rounded bg-[#232630] mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Review({ formData, onPlanParsed }) {
  const [parsedPlan, setParsedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchParsedPlan() {
    setIsLoading(true);
    setError(null);

    try {
      let body = {};

      if (formData.planMode === "pdf" && formData.planFile) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(formData.planFile);
        });
        body = { planFile: base64, planFileName: formData.planFileName };
      } else {
        body = { planText: formData.planText };
      }

      const res = await fetch("/api/parse-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to parse workout plan");
      }

      const data = await res.json();
      setParsedPlan(data.plan);
      onPlanParsed?.(data.plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
 

  useEffect(() => {
    fetchParsedPlan();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">
              Step 4 of 4
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Review Your Plan
            </h2>
            <p className="text-sm text-[#8b8d98] max-w-2xl">
              AI parsed your plan — edit anything before confirming.
            </p>
          </div>
          {!isLoading && !error && parsedPlan && (
            <span className="rounded-full border border-[#4fef48] bg-[#141d10] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c4f135]">
              ⚡ AI PARSED
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading && <LoadingSkeleton />}

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-900/20 p-8 text-center space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchParsedPlan}
              className="inline-flex items-center gap-2 rounded-full border border-[#c4f135] px-5 py-3 text-sm font-semibold text-[#c4f135] transition hover:bg-[#c4f135]/10"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && parsedPlan && (
          <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-6">
            {parsedPlan.map((section) => (
              <div
                key={section.day}
                className="mb-5 last:mb-0 rounded-3xl border border-[#181b23] bg-[#0f131d] p-5"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#232630]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-3.5 w-3.5 rounded-full ${badgeColor(section.category)}`}
                    />
                    <p className="text-sm font-semibold text-white">
                      {section.category}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6e7387]">
                    {section.day}
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  {section.exercises.map((exercise) => (
                    <div
                      key={exercise.name}
                      className="rounded-2xl border border-[#1f2430] bg-[#11141f] p-4"
                    >
                      <p className="text-white font-semibold">
                        {exercise.name}
                      </p>
                      <p className="text-sm text-[#8b8d98] mt-1">
                        {formatDetails(exercise)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">
              Your basic info
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Age", value: formData.age },
                { label: "Weight", value: `${formData.weight}kg` },
                { label: "Height", value: `${formData.height}cm` },
                { label: "Training since", value: formData.trainingSince },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-[#0f131d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-white mt-2">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-[#0f131d] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">
                Primary goal
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {formData.goal}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">
              Your plan input
            </h3>
            {formData.planMode === "text" ? (
              <div className="rounded-3xl bg-[#0f131d] p-4">
                <pre className="whitespace-pre-wrap break-words text-sm text-[#d5d9e6]">
                  {formData.planText || "No plan text entered yet."}
                </pre>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0f131d] p-4">
                <p className="text-sm text-[#d5d9e6]">PDF selected:</p>
                <p className="mt-2 text-base font-semibold text-white">
                  {formData.planFileName || "No file selected yet."}
                </p>
              </div>
            )}

            <div className="rounded-3xl bg-[#0f131d] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">
                Photo status
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {formData.photoPreview ? "Photo selected" : "No photo uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
