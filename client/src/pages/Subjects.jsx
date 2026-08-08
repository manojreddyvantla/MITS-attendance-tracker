import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import { StatusBadge } from '../components/StatusBadge';
import { SubjectModal } from '../components/SubjectModal';

export const Subjects = () => {
  const { subjects, targetAttendance } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('subjectCode');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects
      .filter(s => {
        const matchesSearch = 
          s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (filterStatus === 'SAFE') matchesStatus = s.attendancePercentage >= targetAttendance;
        else if (filterStatus === 'WARNING') matchesStatus = s.attendancePercentage >= 70 && s.attendancePercentage < targetAttendance;
        else if (filterStatus === 'CRITICAL') matchesStatus = s.attendancePercentage < 70;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }, [subjects, searchTerm, filterStatus, sortField, sortDirection, targetAttendance]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-lg">Course Roster</span>
          <h1 className="text-2xl font-black text-white mt-2">Subject-wise Attendance Analysis</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Detailed breakdown across all {subjects.length || 12} enrolled courses.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search code or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:bg-slate-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 px-3 py-2.5 focus:bg-slate-950 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Status</option>
              <option value="SAFE">Safe (≥ {targetAttendance}%)</option>
              <option value="WARNING">Warning (70% - {targetAttendance-0.01}%)</option>
              <option value="CRITICAL">Critical (&lt; 70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 tracking-wider">
                <th onClick={() => handleSort('subjectCode')} className="py-3.5 px-4 cursor-pointer hover:text-brand-400">
                  <div className="flex items-center gap-1">
                    Subject Code <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('subjectName')} className="py-3.5 px-4 cursor-pointer hover:text-brand-400">
                  <div className="flex items-center gap-1">
                    Subject Name <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('attendedClasses')} className="py-3.5 px-4 text-center cursor-pointer hover:text-brand-400">
                  <div className="flex items-center justify-center gap-1">
                    Present <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('absentClasses')} className="py-3.5 px-4 text-center cursor-pointer hover:text-brand-400">
                  <div className="flex items-center justify-center gap-1">
                    Absent <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('totalClasses')} className="py-3.5 px-4 text-center cursor-pointer hover:text-brand-400">
                  <div className="flex items-center justify-center gap-1">
                    Total Classes <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('attendancePercentage')} className="py-3.5 px-4 text-right cursor-pointer hover:text-brand-400">
                  <div className="flex items-center justify-end gap-1">
                    Attendance % <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 font-medium">
                    No matching subjects found.
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
                        title="View detail modal"
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

      {/* Subject Modal */}
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
