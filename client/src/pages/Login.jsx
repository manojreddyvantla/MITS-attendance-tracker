import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle, Sparkles, ShieldCheck, CheckCircle2, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!rollNumber.trim() || !password.trim()) {
      setError("Please enter your MITS Roll Number and Password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await login(rollNumber.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Unable to authenticate with MITS IMS portal. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-slate-50 to-blue-50/80 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Vibrant Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-brand-400/20 to-indigo-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* College & App Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 items-center justify-center text-white font-black text-3xl shadow-xl shadow-brand-500/30 mb-4 ring-4 ring-white">
            M
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MITS <span className="text-brand-600">Attendance Tracker</span>
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-1.5 flex items-center justify-center gap-1.5">
            <School size={16} className="text-brand-600" />
            <span>Madanapalle Institute of Technology & Science</span>
          </p>
        </div>

        {/* Login Glassmorphic Bright Container */}
        <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-3xl border border-slate-200/90 shadow-2xl shadow-indigo-100/60">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Student Roll Number / Register No
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter Roll Number"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 transition-all font-mono uppercase shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium">Remember Credentials</span>
              </label>

              <span className="text-[11px] text-slate-500 font-medium">Official Student Account</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to MITS IMS...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Banner */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2 justify-center font-medium">
            <ShieldCheck size={15} className="text-brand-600 shrink-0" />
            <span>End-to-end encrypted session directly with MITS portal.</span>
          </div>
        </div>

        {/* Developer Credit Footer (Right-aligned) */}
        <div className="text-right mt-6 pr-2 text-xs space-y-0.5">
          <p className="font-bold text-slate-700">
            Developed by <span className="text-brand-600 font-extrabold">Manoj Kumar Reddy</span>
          </p>
          <p className="text-slate-500 font-semibold text-[11px]">
            CSE(AI &amp; ML)
          </p>
        </div>
      </div>
    </div>
  );
};
