import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { RefreshCw, LogOut, CheckCircle2, User } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { syncAttendance, syncing, syncMessage } = useAttendance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 flex items-center justify-between shadow-lg">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-brand-500/20">
            M
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-none">
              MITS <span className="text-brand-400">Attendance Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Student Portal Dashboard</p>
          </div>
        </div>

        {/* Right User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Roll Number Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-mono text-slate-200 font-bold shadow-xs">
            <User size={14} className="text-brand-400" />
            <span>{user?.rollNumber}</span>
          </div>

          {/* Sync Button */}
          <button
            onClick={syncAttendance}
            disabled={syncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${
              syncing
                ? 'bg-slate-800 opacity-60 cursor-wait'
                : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 active:scale-95 shadow-brand-500/20'
            }`}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden xs:inline">{syncing ? 'Syncing...' : 'Sync Attendance'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-all shadow-xs"
            title="Logout"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sync Toast Notification */}
      {syncMessage && (
        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 mt-4">
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 shadow-md flex items-center justify-between text-xs font-semibold text-indigo-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-brand-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Attendance Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Modern Developer Credit Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-4 px-6 md:px-12 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p className="text-slate-400 font-medium text-[11px] text-center sm:text-left">
          MITS Attendance Tracker &bull; Madanapalle Institute of Technology &amp; Science
        </p>
        <div className="text-center sm:text-right">
          <p className="font-bold text-slate-200 text-xs">
            Developed by <span className="text-brand-400 font-extrabold">Manoj Kumar Reddy</span>
          </p>
          <p className="text-slate-400 font-semibold text-[11px]">
            CSE(AI &amp; ML)
          </p>
        </div>
      </footer>
    </div>
  );
};
