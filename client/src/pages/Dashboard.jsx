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
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md shadow-indigo-100/40">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/25 mt-0.5">
            <UserCheck size={30} />
          </div>

          <div className="space-y-1.5">
            {/* Student Name */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {user?.fullName || `Student (${user?.rollNumber})`}
            </h1>

            {/* Pursuing Year & Branch */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700 flex-wrap pt-0.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-lg">
                <GraduationCap size={16} className="text-brand-600" />
                <span>{user?.pursuingYearText || 'III B.Tech I Semester (3rd Year)'}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <BookOpen size={15} className="text-brand-600" />
                <span>{user?.branchName || 'Computer Science & Engineering (AI & ML)'}</span>
              </div>
            </div>

            <div className="text-[12px] font-medium text-slate-500 pt-0.5">
              Roll No: <strong className="text-slate-800 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{user?.rollNumber}</strong> &bull; Last Synced: <strong className="text-slate-700">{formatSyncedDate(overall.lastSynced)}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={syncAttendance}
          disabled={syncing}
          className={`px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
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
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Attendance</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-black text-slate-900">{overall.attendancePercentage}%</span>
            <StatusBadge percentage={overall.attendancePercentage} target={targetAttendance} size="sm" />
          </div>
          <ProgressBar percentage={overall.attendancePercentage} target={targetAttendance} height="h-2.5" />
        </div>

        {/* Attended Classes */}
        <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/50 rounded-3xl border border-emerald-200/80 p-6 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Attended Classes</span>
            <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-700 block">{overall.attendedClasses}</span>
          <span className="text-xs text-emerald-600 font-semibold">Classes Present</span>
        </div>

        {/* Absent Classes */}
        <div className="bg-gradient-to-br from-rose-50/90 to-pink-50/50 rounded-3xl border border-rose-200/80 p-6 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Absent Classes</span>
            <div className="p-2 rounded-xl bg-rose-100/80 text-rose-700">
              <XCircle size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-rose-700 block">{overall.absentClasses}</span>
          <span className="text-xs text-rose-600 font-semibold">Classes Missed</span>
        </div>

        {/* Total Classes */}
        <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/50 rounded-3xl border border-indigo-200/80 p-6 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Total Conducted</span>
            <div className="p-2 rounded-xl bg-indigo-100/80 text-indigo-700">
              <Clock size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-indigo-800 block">{overall.totalClasses}</span>
          <span className="text-xs text-indigo-600 font-semibold">Total Classes Held</span>
        </div>
      </div>

      {/* Main Subject Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {user?.pursuingYearText || 'Current Year'} &bull; Course Attendance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Subject breakdown and live attendance records for {user?.branchName || 'your enrolled courses'}.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200 tracking-wider">
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
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                    No course attendance records found. Click "Sync Attendance" to fetch from MITS.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((s) => (
                  <tr
                    key={s.subjectCode}
                    onClick={() => setSelectedSubject(s)}
                    className="hover:bg-indigo-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 group-hover:text-brand-700">
                      {s.subjectCode}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {s.subjectName}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600">
                      {s.attendedClasses}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-rose-600">
                      {s.absentClasses}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-600">
                      {s.totalClasses}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-sm text-slate-900">
                      {s.attendancePercentage}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge percentage={s.attendancePercentage} target={targetAttendance} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedSubject(s); }}
                        className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200 transition-colors shadow-xs"
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
