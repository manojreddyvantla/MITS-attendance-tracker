import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ percentage, target = 75, statusOverride, showIcon = true, size = 'md' }) => {
  const pct = parseFloat(percentage) || 0;
  
  let status = statusOverride;
  if (!status) {
    if (pct >= target) status = 'SAFE';
    else if (pct >= 70) status = 'WARNING';
    else status = 'CRITICAL';
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-bold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  if (status === 'SAFE' || pct >= target) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-extrabold ${sizes[size]}`}>
        {showIcon && <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 shrink-0" />}
        SAFE ({pct.toFixed(1)}%)
      </span>
    );
  }

  if (status === 'WARNING' || (pct >= 70 && pct < target)) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-xs font-extrabold ${sizes[size]}`}>
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-600 shrink-0" />}
        WARNING ({pct.toFixed(1)}%)
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs font-extrabold ${sizes[size]}`}>
      {showIcon && <AlertCircle size={iconSizes[size]} className="text-rose-600 shrink-0" />}
      CRITICAL ({pct.toFixed(1)}%)
    </span>
  );
};
