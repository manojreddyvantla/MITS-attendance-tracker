import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle, Sparkles, ShieldCheck, CheckCircle2, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* College & App Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 items-center justify-center text-white font-black text-3xl shadow-xl shadow-brand-500/20 mb-4 ring-4 ring-slate-900">
            M
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MITS <span className="text-brand-400">Attendance Tracker</span>
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1.5 flex items-center justify-center gap-1.5">
            <School size={16} className="text-brand-400" />
            <span>Madanapalle Institute of Technology & Science</span>
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-slate-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Student Roll Number / Register No
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter Roll Number"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono uppercase shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                />
              </div>
            </div>

    <div className="flex items-center justify-between text-xs text-slate-400">
      <span className="text-[11px] text-slate-400 font-medium">MITS Student Session</span>
      <span className="text-[11px] text-slate-500 font-medium">Official Portal Handshake</span>
    </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
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
          <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 justify-center font-medium">
            <ShieldCheck size={15} className="text-brand-400 shrink-0" />
            <span>End-to-end encrypted session directly with MITS portal.</span>
          </div>
        </div>

        {/* Developer Credit Footer (Right-aligned) */}
        <div className="text-right mt-6 pr-2 text-xs space-y-0.5">
          <p className="font-bold text-slate-300">
            Developed by <span className="text-brand-400 font-extrabold">Manoj Kumar Reddy</span>
          </p>
          <p className="text-slate-500 font-semibold text-[11px]">
            CSE(AI &amp; ML)
          </p>
        </div>
      </div>
    </div>
  );
};
