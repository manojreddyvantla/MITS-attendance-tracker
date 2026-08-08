import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Clock, Calendar, Calculator } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';

export const SubjectModal = ({ subject, onClose, targetPct = 75 }) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl border border-slate-700/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <BookOpen size={24} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">{subject.subjectCode}</span>
              <h2 className="text-lg font-bold text-slate-100">{subject.subjectName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Attendance Summary */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Status</span>
            <StatusBadge percentage={subject.attendancePercentage} target={targetPct} size="lg" />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
              <span>Attendance Progress</span>
              <span className="font-bold">{subject.attendancePercentage}%</span>
            </div>
            <ProgressBar percentage={subject.attendancePercentage} target={targetPct} height="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Attended</span>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">{subject.attendedClasses}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Absent</span>
              <p className="text-xl font-bold text-rose-400 mt-0.5">{subject.absentClasses}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total</span>
              <p className="text-xl font-bold text-slate-200 mt-0.5">{subject.totalClasses}</p>
            </div>
          </div>

          {/* Action Recommendation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/60">
            <h4 className="text-xs font-bold text-brand-300 flex items-center gap-1.5 mb-2">
              <Calculator size={16} /> Targeted Bunk & Recovery Plan
            </h4>
            {subject.attendancePercentage >= targetPct ? (
              <p className="text-xs text-slate-300 leading-relaxed">
                You are currently at <strong className="text-emerald-400">{subject.attendancePercentage}%</strong>. You can safely miss up to <strong className="text-emerald-400 font-bold">{subject.safeBunks}</strong> class(es) in {subject.subjectCode} while remaining at or above your target {targetPct}%.
              </p>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                Your attendance is <strong className="text-rose-400">{subject.attendancePercentage}%</strong> (below {targetPct}% target). You must attend the next <strong className="text-amber-400 font-bold">{subject.requiredClasses}</strong> consecutive class(es) in {subject.subjectCode} to recover.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
