import React from 'react';

export const ProgressBar = ({ percentage, target = 75, height = 'h-2.5', showTargetMarker = true }) => {
  const pct = Math.min(100, Math.max(0, parseFloat(percentage) || 0));

  let barColor = 'bg-emerald-500 shadow-emerald-500/50';
  if (pct < 70) {
    barColor = 'bg-rose-500 shadow-rose-500/50';
  } else if (pct < target) {
    barColor = 'bg-amber-500 shadow-amber-500/50';
  }

  return (
    <div className="relative w-full">
      <div className={`w-full bg-slate-700/60 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${barColor} transition-all duration-500 rounded-full shadow-sm`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showTargetMarker && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-brand-400 z-10 opacity-80"
          style={{ left: `${target}%` }}
          title={`Target ${target}%`}
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-brand-400 rotate-45 rounded-sm" />
        </div>
      )}
    </div>
  );
};
