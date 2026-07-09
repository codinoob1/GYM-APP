'use client';

import { useRef } from 'react';

export default function Photo({ formData, onPhotoSelect }) {
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'image/png') {
      onPhotoSelect(null, 'Please upload a PNG image only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onPhotoSelect({ file, preview: reader.result }, '');
    };
    reader.readAsDataURL(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Upload a Progress Photo</p>
        <p className="text-sm text-[#8b8d98] max-w-2xl">
          Optional — used as a visual baseline. Stored privately.
        </p>
      </div>

      <div
        className="relative rounded-3xl border border-dashed border-[#232630] bg-[#11141f] p-10 text-center hover:border-[#c4f135] transition-colors"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1b2130] text-[#8b8d98]">
          <span className="text-2xl">📷</span>
        </div>
        <div className="mt-6 space-y-3">
          <p className="text-white font-semibold">Drag & drop or click to upload</p>
          <p className="text-sm text-[#6e7387]">PNG only, up to 10MB</p>
          <button
            type="button"
            onClick={handleChooseFile}
            className="inline-flex items-center gap-2 rounded-full border border-[#c4f135] bg-transparent px-5 py-3 text-sm font-semibold text-[#c4f135] transition hover:bg-[#c4f135]/10"
          >
            Choose File
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {formData.photoPreview && (
        <div className="rounded-3xl border border-[#232630] bg-[#11141f] p-4 flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#0a0d14]">
            <img src={formData.photoPreview} alt="Selected profile" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Selected photo</p>
            <p className="text-sm text-[#8b8d98]">{formData.photo?.name || 'progress-photo.png'}</p>
          </div>
        </div>
      )}

      {formData.photoError && (
        <p className="text-sm text-red-400">{formData.photoError}</p>
      )}
    </div>
  );
}
