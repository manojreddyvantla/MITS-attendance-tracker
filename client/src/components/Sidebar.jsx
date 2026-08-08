import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  TrendingUp,
  Calendar,
  Bot,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { unreadCount } = useAttendance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', path: '/subjects', icon: BookOpen },
    { label: 'Calculator', path: '/calculator', icon: Calculator },
    { label: 'Prediction', path: '/prediction', icon: TrendingUp },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'AI Assistant', path: '/assistant', icon: Bot, badge: 'AI' },
    { label: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/90 flex flex-col transition-transform duration-300 md:translate-x-0 shadow-lg shadow-indigo-100/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-bold text-lg">
              M
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                MITS <span className="text-brand-600">Attendance</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Official Academic Suite</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card Summary */}
        {user && (
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-brand-500/20 shrink-0">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') : (user.rollNumber ? user.rollNumber.substring(0, 2) : 'ST')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-snug">{user.fullName || `Student (${user.rollNumber})`}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] text-brand-700 font-bold bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                  {user.rollNumber}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold truncate">MITS</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-indigo-100 text-indigo-700 uppercase border border-indigo-200">
                    {item.badge}
                  </span>
                )}
                {item.count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout Application</span>
          </button>
        </div>
      </aside>
    </>
  );
};
