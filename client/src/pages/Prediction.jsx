import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, AlertTriangle, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Prediction = () => {
  const { targetAttendance } = useAttendance();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, [targetAttendance]);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/attendance/predict', { targetAttendancePct: targetAttendance });
      if (res.data.success) {
        setPrediction(res.data.prediction);
      }
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'LOW':
        return <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-extrabold">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-extrabold">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-extrabold">HIGH RISK</span>;
      case 'CRITICAL':
      default:
        return <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-sm font-extrabold animate-pulse">CRITICAL RISK</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <TrendingUp size={28} />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">Predictive Analytics</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">Attendance Risk & Prediction Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Forecasting subject risks, recovery paths, and condonation protection.</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 text-xs">
          Analyzing attendance trends...
        </div>
      ) : prediction ? (
        <div className="space-y-6">
          {/* Main Risk Overview Banner */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Academic Risk Level</span>
                <div className="mt-2 flex items-center gap-3">
                  {getRiskBadge(prediction.overallRiskLevel)}
                  <span className="text-2xl font-extrabold text-white">
                    {prediction.overallAttendancePercentage}% <span className="text-xs font-normal text-slate-400">(Target: {targetAttendance}%)</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-right">
                <span className="text-xs text-slate-400 font-medium">Critical Subjects Needing Action</span>
                <p className="text-xl font-bold text-rose-400 mt-0.5">{prediction.criticalCount} / {prediction.subjectAnalysis.length}</p>
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/60">
              <h3 className="text-xs font-bold text-brand-300 flex items-center gap-1.5 mb-2">
                <Sparkles size={16} /> Recommended Action Plan
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{prediction.recommendation}"
              </p>
            </div>
          </div>

          {/* Subject Risk Matrix Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h2 className="text-base font-bold text-slate-100 mb-4">Subject Risk Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prediction.subjectAnalysis.map((sub) => (
                <div
                  key={sub.subjectCode}
                  className={`p-4 rounded-2xl border transition-all ${
                    sub.riskLevel === 'CRITICAL' || sub.riskLevel === 'HIGH'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : sub.riskLevel === 'MEDIUM'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-brand-400">{sub.subjectCode}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      sub.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                      sub.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {sub.riskLevel}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 truncate">{sub.subjectName}</h3>
                  <div className="mt-3 flex justify-between items-baseline">
                    <span className="text-2xl font-extrabold text-white">{sub.attendancePercentage}%</span>
                    <span className="text-[11px] text-slate-400">{sub.attendedClasses}/{sub.totalClasses} classes</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-300">
                    {sub.requiredClasses > 0 ? (
                      <span className="text-amber-400 font-semibold">
                        Must attend next <strong>{sub.requiredClasses}</strong> consecutive classes.
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        <strong>{sub.safeBunks}</strong> safe bunks remaining.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
