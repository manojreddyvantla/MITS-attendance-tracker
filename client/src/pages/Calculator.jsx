import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator as CalcIcon, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Calculator = () => {
  const { overall, targetAttendance } = useAttendance();
  const [attended, setAttended] = useState(60);
  const [total, setTotal] = useState(85);
  const [target, setTarget] = useState(targetAttendance || 75);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync initial inputs with overall state
  useEffect(() => {
    if (overall.totalClasses > 0) {
      setAttended(overall.attendedClasses);
      setTotal(overall.totalClasses);
    }
  }, [overall]);

  useEffect(() => {
    handleCalculate();
  }, [attended, total, target]);

  const handleCalculate = async () => {
    if (attended === '' || total === '' || total === 0) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/attendance/calculate', {
        attendedClasses: parseInt(attended, 10) || 0,
        totalClasses: parseInt(total, 10) || 0,
        targetAttendancePct: parseFloat(target) || 75
      });
      if (res.data.success) {
        setResult(res.data.calculation);
      }
    } catch (err) {
      console.error("Calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <CalcIcon size={28} />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">Exact Math Engine</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">Attendance & Safe Bunk Calculator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform exact integer math calculations for required consecutive classes and safe bunks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Input Parameters</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Classes Attended
            </label>
            <input
              type="number"
              min="0"
              value={attended}
              onChange={(e) => setAttended(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Total Classes Held
            </label>
            <input
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm font-bold text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Attendance Percentage (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="50"
                max="99"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm font-bold text-brand-400 focus:outline-none focus:border-brand-500"
              />
              <div className="flex gap-1.5 shrink-0">
                {[70, 75, 80, 85].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTarget(t)}
                    className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                      Number(target) === t
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Calculation Results */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Calculation Results</h2>

          {result ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {/* Current Attendance Output */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">1. Current Attendance</span>
                <span className={`text-2xl font-extrabold ${result.currentPercentage >= target ? 'text-emerald-400' : result.currentPercentage >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {result.currentPercentage}%
                </span>
              </div>

              {/* Classes Required Output */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">2. Classes Required to Reach Target</span>
                {result.requiredClasses === 0 ? (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
                    <CheckCircle2 size={16} /> Target Reached! No extra consecutive classes required.
                  </p>
                ) : (
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    You need to attend <strong className="text-white text-lg underline">{result.requiredClasses}</strong> consecutive classes to reach {target}%.
                  </p>
                )}
              </div>

              {/* Safe Bunks Output */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">3. Classes That Can Be Missed (Safe Bunks)</span>
                {result.safeBunks > 0 ? (
                  <p className="text-sm font-bold text-emerald-400 mt-1">
                    You can miss <strong className="text-white text-lg underline">{result.safeBunks}</strong> class(es) while remaining at or above {target}%.
                  </p>
                ) : (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                    <AlertTriangle size={16} /> 0 safe bunks available. Any absence will cause attendance to fall further below target.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Calculating...
            </div>
          )}

          <div className="text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            * Integer formulas calculated deterministically via server utility math functions.
          </div>
        </div>
      </div>
    </div>
  );
};
