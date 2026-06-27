'use client';

export default function Review({ formData }) {
  const dummyPlan = [
    {
      group: 'Chest / Triceps',
      day: 'Monday',
      exercises: [
        { name: 'Bench Press', details: '4×8 @ 80kg' },
        { name: 'Incline DB Press', details: '3×10 @ 28kg' },
        { name: 'Cable Tricep Pushdown', details: '3×12 @ 22.5kg' },
      ],
      badge: 'lime',
    },
    {
      group: 'Back / Biceps',
      day: 'Wednesday',
      exercises: [
        { name: 'Barbell Row', details: '4×8 @ 90kg' },
        { name: 'Lat Pulldown', details: '3×10 @ 62.5kg' },
        { name: 'EZ-Bar Curl', details: '3×12 @ 32.5kg' },
      ],
      badge: 'cyan',
    },
    {
      group: 'Legs / Core',
      day: 'Friday',
      exercises: [
        { name: 'Barbell Squat', details: '4×6 @ 110kg' },
        { name: 'Romanian Deadlift', details: '3×10 @ 80kg' },
        { name: 'Leg Press', details: '3×12 @ 120kg' },
      ],
      badge: 'purple',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Step 4 of 4</p>
            <h2 className="text-3xl font-bold tracking-tight">Review Your Plan</h2>
            <p className="text-sm text-[#8b8d98] max-w-2xl">AI parsed your plan — edit anything before confirming.</p>
          </div>
          <span className="rounded-full border border-[#4fef48] bg-[#141d10] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c4f135]">
            ⚡ AI PARSED
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-6">
          {dummyPlan.map((section) => (
            <div key={section.group} className="mb-5 last:mb-0 rounded-3xl border border-[#181b23] bg-[#0f131d] p-5">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#232630]">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-3.5 w-3.5 rounded-full ${section.badge === 'lime' ? 'bg-[#c4f135]' : section.badge === 'cyan' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
                  <p className="text-sm font-semibold text-white">{section.group}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#6e7387]">{section.day}</p>
              </div>
              <div className="mt-4 space-y-4">
                {section.exercises.map((exercise) => (
                  <div key={exercise.name} className="rounded-2xl border border-[#1f2430] bg-[#11141f] p-4">
                    <p className="text-white font-semibold">{exercise.name}</p>
                    <p className="text-sm text-[#8b8d98] mt-1">{exercise.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Your basic info</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Age', value: formData.age },
                { label: 'Weight', value: `${formData.weight}kg` },
                { label: 'Height', value: `${formData.height}cm` },
                { label: 'Training since', value: formData.trainingSince },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-[#0f131d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">{item.label}</p>
                  <p className="text-base font-semibold text-white mt-2">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-[#0f131d] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">Primary goal</p>
              <p className="mt-2 text-base font-semibold text-white">{formData.goal}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Your plan input</h3>
            {formData.planMode === 'text' ? (
              <div className="rounded-3xl bg-[#0f131d] p-4">
                <pre className="whitespace-pre-wrap break-words text-sm text-[#d5d9e6]">{formData.planText || 'No plan text entered yet.'}</pre>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0f131d] p-4">
                <p className="text-sm text-[#d5d9e6]">PDF selected:</p>
                <p className="mt-2 text-base font-semibold text-white">{formData.planFileName || 'No file selected yet.'}</p>
              </div>
            )}

            <div className="rounded-3xl bg-[#0f131d] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7387]">Photo status</p>
              <p className="mt-2 text-base font-semibold text-white">
                {formData.photoPreview ? 'Photo selected' : 'No photo uploaded'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
