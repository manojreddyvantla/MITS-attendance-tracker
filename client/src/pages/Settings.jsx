import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Target, Bell, RefreshCw, Bot, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAttendance } from '../context/AttendanceContext';

export const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { targetAttendance, updateTargetThreshold } = useAttendance();

  const [saved, setSaved] = useState(false);
  const [notifyLowAttendance, setNotifyLowAttendance] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [autoSyncOnLogin, setAutoSyncOnLogin] = useState(true);
  const [aiContextEnabled, setAiContextEnabled] = useState(true);

  const targets = [65, 70, 75, 80, 85, 90];

  const handleTargetChange = (val) => {
    updateTargetThreshold(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <SettingsIcon size={28} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">Configuration</span>
            <h1 className="text-2xl font-extrabold text-white mt-0.5">Application Preferences</h1>
          </div>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 size={16} /> Preferences Saved
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* 1. Theme Setting */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Interface Theme</h2>
              <p className="text-xs text-slate-400">Switch between Dark and Light SaaS modes.</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-2"
          >
            {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-400" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* 2. Target Attendance Configuration */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Configurable Attendance Target Threshold</h2>
              <p className="text-xs text-slate-400">Default target is 75% required by MITS academic regulations.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {targets.map((t) => (
              <button
                key={t}
                onClick={() => handleTargetChange(t)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold border transition-all ${
                  targetAttendance === t
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-400 shadow-lg shadow-brand-500/30 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {t}% Target {t === 75 && '(Default)'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Notification & Sync Preferences */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Bell size={18} className="text-brand-400" /> Notifications & Sync Preferences
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <span className="text-xs font-semibold text-slate-300">Notify when subject attendance drops below target</span>
              <input
                type="checkbox"
                checked={notifyLowAttendance}
                onChange={(e) => setNotifyLowAttendance(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-800 bg-slate-950 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <span className="text-xs font-semibold text-slate-300">Auto-sync MITS portal attendance upon login</span>
              <input
                type="checkbox"
                checked={autoSyncOnLogin}
                onChange={(e) => setAutoSyncOnLogin(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-800 bg-slate-950 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <span className="text-xs font-semibold text-slate-300">Enable AI Context Enrichment for Attendance Assistant</span>
              <input
                type="checkbox"
                checked={aiContextEnabled}
                onChange={(e) => setAiContextEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-800 bg-slate-950 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
