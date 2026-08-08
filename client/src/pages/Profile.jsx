import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Shield, BookOpen, GraduationCap, Lock, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    rollNumber: user?.rollNumber || '',
    department: 'Computer Science & Engineering (AI & ML)',
    year: 3,
    semester: 6,
    email: user?.email || ''
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/student/profile');
      if (res.data.success && res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await axios.put('/api/student/profile', {
        fullName: profile.fullName,
        email: profile.email
      });
      if (res.data.success) {
        updateUser({ fullName: profile.fullName, email: profile.email });
        setMessage({ type: 'success', text: 'Profile information updated successfully.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <User size={28} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">Student Account</span>
            <h1 className="text-2xl font-extrabold text-white mt-0.5">Student Profile Settings</h1>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-2"
        >
          <LogOut size={16} /> Logout Application
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-brand-500/30">
            {profile.rollNumber ? profile.rollNumber.substring(0, 2) : 'ST'}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{profile.fullName}</h2>
            <span className="text-xs font-mono font-bold text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mt-1 inline-block">
              {profile.rollNumber}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <GraduationCap size={16} className="text-brand-400" />
              <span>Dept: <strong>CSE (AI & ML)</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpen size={16} className="text-indigo-400" />
              <span>Academic Year: <strong>Year {profile.year}, Sem {profile.semester}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail size={16} className="text-amber-400" />
              <span className="truncate">{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Update Information</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Roll Number (Read-only)
              </label>
              <input
                type="text"
                disabled
                value={profile.rollNumber}
                className="w-full px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
