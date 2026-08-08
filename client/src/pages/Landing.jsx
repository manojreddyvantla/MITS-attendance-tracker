import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Calculator,
  Bell,
  Bot,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3
} from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      title: "Smart Attendance Tracking",
      desc: "Instant sync with MITS portal providing normalized real-time attendance statistics.",
      icon: BarChart3
    },
    {
      title: "Subject-wise Analysis",
      desc: "Granular breakdown of present, absent, total classes, and target thresholds.",
      icon: Cpu
    },
    {
      title: "AI Prediction",
      desc: "Predict future risk levels (LOW, MEDIUM, HIGH, CRITICAL) before shortages happen.",
      icon: TrendingUp
    },
    {
      title: "Safe Bunk Calculator",
      desc: "Calculates exact integer safe bunks and required consecutive present classes.",
      icon: Calculator
    },
    {
      title: "Attendance Alerts",
      desc: "Proactive smart notifications whenever subject attendance drops below target.",
      icon: Bell
    },
    {
      title: "AI Assistant",
      desc: "ChatGPT-style student advisor answering custom bunk strategies with real data.",
      icon: Bot
    }
  ];

  const steps = [
    { step: "01", title: "Connect", desc: "Securely link your MITS Roll Number." },
    { step: "02", title: "Sync", desc: "Retrieve permitted attendance data via provider interface." },
    { step: "03", title: "Analyze", desc: "Evaluate overall & subject-level percentage matrices." },
    { step: "04", title: "Predict", desc: "Forecast risk thresholds and required recovery classes." },
    { step: "05", title: "Improve", desc: "Never lose attendance or face shortage condonation again!" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white font-sans overflow-x-hidden">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/20">
            M
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">
              MITS <span className="text-brand-400">Attendance AI</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">CSE-AI & ML Intelligence Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles size={14} className="text-brand-400" /> Powered by Advanced Prediction & Risk Analytics
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          MITS Attendance AI
        </h1>
        <p className="mt-4 text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-300 via-indigo-200 to-slate-400 bg-clip-text text-transparent">
          Track. Analyze. Predict. Never lose attendance again.
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          An intelligent AI-powered attendance tracker, calculator, and risk predictor built exclusively for students of Madanapalle Institute of Technology & Science (MITS).
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white font-bold text-sm border border-slate-700 hover:border-slate-500 transition-all"
          >
            Student Login
          </Link>
        </div>

        {/* Hero Preview Card */}
        <div className="mt-16 relative max-w-4xl mx-auto rounded-3xl glass-panel p-4 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase">Overall Attendance</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">78.6%</p>
              <span className="text-[11px] text-emerald-400/80 font-medium">Safe Margin (+3.6% above 75%)</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Attended</span>
              <p className="text-3xl font-extrabold text-white mt-1">92 / 117</p>
              <span className="text-[11px] text-slate-400">25 Classes Absent</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase">Risk Status</span>
              <p className="text-3xl font-extrabold text-brand-400 mt-1">LOW</p>
              <span className="text-[11px] text-brand-300/80">DBMS Needs Focus (68.9%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Main Intelligent Features</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to maintain 75%+ attendance with zero guesswork.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 border border-brand-500/20">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900 bg-slate-900/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">How It Works</h2>
          <p className="text-sm text-slate-400 mt-2">5 simple steps to complete attendance control.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full mb-3 border border-brand-500/20">
                {s.step}
              </span>
              <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>MITS Attendance AI &copy; 2026. Designed for Madanapalle Institute of Technology & Science.</p>
      </footer>
    </div>
  );
};
