'use client';

export default function Basic({ formData, onFieldChange }) {
  const goals = ['Strength', 'Hypertrophy', 'Endurance', 'Fat Loss','Calisthenics','Powerlifting','Olympic Weightlifting','CrossFit','Bodybuilding'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'name', label: 'Name', unit: '', placeholder: 'Sahil',type: 'text' },
          { name: 'age', label: 'Age', unit: 'yrs', placeholder: '28',type: 'number'  },
          { name: 'weight', label: 'Weight', unit: 'kg', placeholder: '82' , type:'number' },
          { name: 'height', label: 'Height', unit: 'cm', placeholder: '178' },
          { name: 'trainingSince', label: 'Training Since', unit: 'year', placeholder: '2019' ,type:'number'},
        ].map(({ name, label, unit, placeholder ,type}) => (
          <div key={name} className="space-y-3">
            <label className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">
              {label}
            </label>
            <div className="relative rounded-3xl border border-[#232630] bg-[#11141f] px-4 py-4 shadow-inner shadow-black/20">
              <input
                type={type}
                value={formData[name]}
                onChange={(event) => onFieldChange(name, event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none text-white text-lg font-semibold outline-none placeholder:text-[#5f6373]"
              />
              
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8d98] text-xs uppercase">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Primary Goal</p>
        <div className="flex flex-wrap gap-3">
          {goals.map((goal) => {
            const active = formData.goal === goal;
            return (
              <button
                key={goal}
                type="button"
                onClick={() => onFieldChange('goal', goal)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${active ? 'bg-[#c4f135] text-black shadow-[0_0_0_1px_rgba(196,241,53,0.6)]' : 'bg-[#11141f] text-[#c7cad2] border border-[#232630] hover:border-[#c4f135]'}`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
