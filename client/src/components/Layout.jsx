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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Bright Ultra-Clean Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 px-4 md:px-8 flex items-center justify-between shadow-sm">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-brand-500/20">
            M
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">
              MITS <span className="text-brand-600">Attendance Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">Student Portal Dashboard</p>
          </div>
        </div>

        {/* Right User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Roll Number Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 font-bold shadow-xs">
            <User size={14} className="text-brand-600" />
            <span>{user?.rollNumber}</span>
          </div>

          {/* Sync Button */}
          <button
            onClick={syncAttendance}
            disabled={syncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${
              syncing
                ? 'bg-slate-300 opacity-70 cursor-wait'
                : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 active:scale-95 shadow-brand-500/25'
            }`}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden xs:inline">{syncing ? 'Syncing...' : 'Sync Attendance'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all shadow-xs"
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
          <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200/80 shadow-sm flex items-center justify-between text-xs font-semibold text-brand-900">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-brand-600 shrink-0" />
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
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-4 px-6 md:px-12 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p className="text-slate-500 font-medium text-[11px] text-center sm:text-left">
          MITS Attendance Tracker &bull; Madanapalle Institute of Technology &amp; Science
        </p>
        <div className="text-center sm:text-right">
          <p className="font-bold text-slate-800 text-xs">
            Developed by <span className="text-brand-600 font-extrabold">Manoj Kumar Reddy</span>
          </p>
          <p className="text-slate-500 font-semibold text-[11px]">
            CSE(AI &amp; ML)
          </p>
        </div>
      </footer>
    </div>
  );
};
