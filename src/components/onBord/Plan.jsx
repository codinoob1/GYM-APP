'use client';

export default function Plan({ formData, onFieldChange, onPlanFileChange }) {
  const fileInputId = 'plan-pdf-upload';

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Your Current Plan</p>
        <p className="text-sm text-[#8b8d98] max-w-2xl">AI will parse exercises, sets, reps, and weights automatically.</p>
      </div>

      <div className="inline-flex rounded-full border border-[#232630] bg-[#11141f] p-1 text-sm text-white shadow-inner shadow-black/20">
        {['text', 'pdf'].map((mode) => {
          const active = formData.planMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onFieldChange('planMode', mode)}
              className={`px-5 py-3 rounded-full transition ${active ? 'bg-[#1a242f] text-[#c4f135]' : 'text-[#8b8d98] hover:bg-white/5'}`}
            >
              {mode === 'text' ? 'Paste Text' : 'Upload PDF'}
            </button>
          );
        })}
      </div>

      {formData.planMode === 'text' ? (
        <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-5">
          <textarea
            value={formData.planText}
            onChange={(event) => onFieldChange('planText', event.target.value)}
            rows={12}
            className="w-full resize-none rounded-3xl border-none bg-[#11141f] px-4 py-4 text-sm text-[#d5d9e6] outline-none placeholder:text-[#5f6373]"
            placeholder="Monday - Chest/Triceps:&#10;Bench Press: 4x8 @ 80kg&#10;Incline DB Press: 3x10 @ 28kg&#10;Cable Tricep Pushdown: 3x12 @ 22.5kg"
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#232630] bg-[#11141f] p-10 text-center">
          <p className="text-sm text-[#8b8d98]">Upload a PDF of your workout plan. Only .pdf files are accepted for now.</p>
          <div className="mt-6 inline-flex items-center gap-3">
            <label
              htmlFor={fileInputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#c4f135] px-5 py-3 text-sm font-semibold text-[#c4f135] transition hover:bg-[#c4f135]/10"
            >
              Choose File
            </label>
            <span className="text-sm text-[#d5d9e6]">
              {formData.planFileName || 'No file selected yet'}
            </span>
          </div>
          <input
            id={fileInputId}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onPlanFileChange(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
