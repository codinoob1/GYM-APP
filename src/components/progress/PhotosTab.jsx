export default function PhotosTab({ photoPreview }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-[#13141a] border border-[#2a2d37] rounded-xl overflow-hidden aspect-square">
          {photoPreview ? (
            <img src={photoPreview} alt="Before" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-[#8b8d98] text-sm">No photo</div>
          )}
          <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
            Before
          </span>
        </div>

        <div className="relative bg-[#13141a] border border-[#2a2d37] rounded-xl overflow-hidden aspect-square">
          <div className="w-full h-full grid place-items-center text-[#8b8d98] text-sm">
            Progress photo will appear here
          </div>
          <span className="absolute top-3 right-3 bg-[#c4f135] text-black text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
            After
          </span>
        </div>
      </div>

      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-8 text-center">
        <p className="text-[#8b8d98] text-sm">
          📷 Add progress photos to track your visual changes over time.
        </p>
      </div>
    </div>
  );
}
