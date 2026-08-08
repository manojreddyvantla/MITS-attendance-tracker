import React from 'react';
import { Menu, RefreshCw, Sun, Moon, Sparkles, User, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAttendance } from '../context/AttendanceContext';
import { NotificationBell } from './NotificationBell';

export const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { syncAttendance, syncing } = useAttendance();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Live MITS Sync status & Logged-in Student Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <Globe size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200">Portal Sync:</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px]">
              Connected
            </span>
          </div>

          {user && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
              <User size={13} className="text-brand-400" />
              <span className="truncate max-w-[200px]">{user.fullName || user.rollNumber}</span>
              <span className="font-mono text-[10px] text-slate-400">({user.rollNumber})</span>
            </div>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync Button */}
        <button
          onClick={syncAttendance}
          disabled={syncing}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
            syncing
              ? 'bg-slate-700 cursor-wait'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:scale-95 shadow-brand-500/20'
          }`}
          title="Sync live attendance with MITS IMS"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span className="hidden xs:inline">{syncing ? 'Syncing...' : 'Sync Attendance'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
        </button>

        {/* Notification Bell */}
        <NotificationBell />
      </div>
    </header>
  );
};
