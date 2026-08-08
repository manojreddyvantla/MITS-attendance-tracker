import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  UserCheck,
  GraduationCap,
  BookOpen,
  Globe
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { SubjectModal } from '../components/SubjectModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const { overall, subjects, targetAttendance, syncAttendance, syncing } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s =>
    s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSyncedDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Credentials, Pursuing Year & Branch */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 mt-0.5">
            <UserCheck size={30} />
          </div>

          <div className="space-y-1.5">
            {/* Student Name */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user?.fullName || `Student (${user?.rollNumber})`}
            </h1>

            {/* Pursuing Year & Branch */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 flex-wrap pt-0.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-lg">
                <GraduationCap size={16} className="text-brand-400" />
                <span>{user?.pursuingYearText || 'III B.Tech I Semester (3rd Year)'}</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <BookOpen size={15} className="text-brand-400" />
                <span>{user?.branchName || 'Computer Science & Engineering (AI & ML)'}</span>
              </div>
            </div>

            <div className="text-[12px] font-medium text-slate-400 pt-0.5">
              Roll No: <strong className="text-slate-200 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{user?.rollNumber}</strong> &bull; Last Synced: <strong className="text-slate-300">{formatSyncedDate(overall.lastSynced)}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={syncAttendance}
          disabled={syncing}
          className={`px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
            syncing ? 'opacity-60 cursor-wait' : ''
          }`}
        >
          <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing...' : 'Sync Attendance'}</span>
        </button>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Overall Percentage */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-3.5 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-black text-white">{overall.attendancePercentage}%</span>
            <StatusBadge percentage={overall.attendancePercentage} target={targetAttendance} size="sm" />
          </div>
          <ProgressBar percentage={overall.attendancePercentage} target={targetAttendance} height="h-2.5" />
        </div>

        {/* Attended Classes */}
        <div className="bg-emerald-950/20 rounded-3xl border border-emerald-500/20 p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Attended Classes</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 block">{overall.attendedClasses}</span>
          <span className="text-xs text-emerald-300/80 font-semibold">Classes Present</span>
        </div>

        {/* Absent Classes */}
        <div className="bg-rose-950/20 rounded-3xl border border-rose-500/20 p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Absent Classes</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <XCircle size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-rose-400 block">{overall.absentClasses}</span>
          <span className="text-xs text-rose-300/80 font-semibold">Classes Missed</span>
        </div>

        {/* Total Classes */}
        <div className="bg-indigo-950/20 rounded-3xl border border-indigo-500/20 p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Total Conducted</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Clock size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-indigo-200 block">{overall.totalClasses}</span>
          <span className="text-xs text-indigo-300/80 font-semibold">Total Classes Held</span>
        </div>
      </div>

      {/* Main Subject Attendance Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              {user?.pursuingYearText || 'Current Year'} &bull; Course Attendance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Subject breakdown and live attendance records for {user?.branchName || 'your enrolled courses'}.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search code or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 tracking-wider">
                <th className="py-3.5 px-4 rounded-l-xl">Subject Code</th>
                <th className="py-3.5 px-4">Subject Name</th>
                <th className="py-3.5 px-4 text-center">Attended</th>
                <th className="py-3.5 px-4 text-center">Absent</th>
                <th className="py-3.5 px-4 text-center">Total</th>
                <th className="py-3.5 px-4 text-right">Attendance %</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center rounded-r-xl">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 font-medium">
                    No course attendance records found. Click "Sync Attendance" to fetch from MITS.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((s) => (
                  <tr
                    key={s.subjectCode}
                    onClick={() => setSelectedSubject(s)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-brand-400 group-hover:text-brand-300">
                      {s.subjectCode}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      {s.subjectName}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-400">
                      {s.attendedClasses}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-rose-400">
                      {s.absentClasses}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-400">
                      {s.totalClasses}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-sm text-white">
                      {s.attendancePercentage}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge percentage={s.attendancePercentage} target={targetAttendance} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedSubject(s); }}
                        className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20 transition-colors shadow-xs"
                        title="View details"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubject && (
        <SubjectModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
          targetPct={targetAttendance}
        />
      )}
    </div>
  );
};
