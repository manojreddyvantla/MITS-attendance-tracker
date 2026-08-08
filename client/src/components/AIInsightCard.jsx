import React from 'react';
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIInsightCard = ({ overallPct = 78.6, target = 75, criticalSubjects = [] }) => {
  const isBelowTarget = overallPct < target;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/20 p-5 shadow-xl">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
            <Sparkles size={18} />
          </div>
          <h3 className="font-semibold text-sm text-slate-100 tracking-wide">AI Attendance Insight</h3>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
          Smart Recommendation
        </span>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-300 leading-relaxed">
          {isBelowTarget ? (
            <>
              Your overall attendance is <strong className="text-rose-400 font-bold">{overallPct}%</strong>, which is currently below your <strong className="text-white">{target}%</strong> target.
            </>
          ) : (
            <>
              Your overall attendance is <strong className="text-emerald-400 font-bold">{overallPct}%</strong>, safely above your <strong className="text-white">{target}%</strong> target.
            </>
          )}
        </p>

        {criticalSubjects.length > 0 ? (
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={14} /> Highest-Risk Subjects Needing Attention:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {criticalSubjects.map((s, idx) => (
                <li key={idx} className="flex justify-between items-center bg-slate-900/60 px-2.5 py-1.5 rounded-lg">
                  <span className="font-medium text-slate-200">{s.subjectName || s.subjectCode}</span>
                  <span className={`font-bold ${s.attendancePercentage < 70 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {s.attendancePercentage}% ({s.requiredClasses || 0} req)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-emerald-950/20 rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            All subjects are in good standing! Keep up your current attendance routine.
          </div>
        )}

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Ask assistant for tailored bunk strategies.</span>
          <Link
            to="/assistant"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Ask AI Assistant <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
