import React from 'react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Notifications = () => {
  const { notifications, unreadCount, markNotificationRead } = useAttendance();

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />;
      case 'WARNING': return <AlertTriangle className="text-amber-400 shrink-0" size={20} />;
      case 'ALERT': return <AlertCircle className="text-rose-400 shrink-0" size={20} />;
      default: return <Info className="text-brand-400 shrink-0" size={20} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Bell size={28} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">Alerts Center</span>
            <h1 className="text-2xl font-extrabold text-white mt-0.5">Smart Attendance Notifications</h1>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markNotificationRead('all')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Check size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No notifications available.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-5 hover:bg-slate-800/40 transition-colors flex items-start gap-4 cursor-pointer ${
                !n.isRead ? 'bg-brand-950/20' : 'opacity-70'
              }`}
            >
              {getIcon(n.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200">{n.title}</h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
