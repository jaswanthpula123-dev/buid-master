import React from 'react';

const ProgressBar = ({ percentage = 0, label = 'Construction Progress', showLabel = true, size = 'md' }) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  
  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
            {label}
          </span>
          <span className="text-navy-900 font-bold">{clamped}% Completed</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heightClass} p-0.5`}>
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${clamped}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
