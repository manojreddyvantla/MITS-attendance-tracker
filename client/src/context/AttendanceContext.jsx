import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [overall, setOverall] = useState({
    attendedClasses: 0,
    absentClasses: 0,
    totalClasses: 0,
    attendancePercentage: 0,
    status: 'SAFE',
    subjectsCount: 0,
    lastSynced: null
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [targetAttendance, setTargetAttendance] = useState(user?.targetAttendancePct || 75);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setTargetAttendance(user.targetAttendancePct || 75);
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, ovRes, notifRes] = await Promise.all([
        axios.get('/api/attendance'),
        axios.get('/api/attendance/overall'),
        axios.get('/api/notifications')
      ]);

      if (subRes.data.success) setSubjects(subRes.data.subjects);
      if (ovRes.data.success) setOverall(ovRes.data.overall);
      if (notifRes.data.success) {
        setNotifications(notifRes.data.notifications);
        setUnreadCount(notifRes.data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncAttendance = async () => {
    setSyncing(true);
    setSyncMessage("Syncing attendance with MITS portal...");
    try {
      const res = await axios.post('/api/attendance/sync');
      if (res.data.success) {
        setSyncMessage("Attendance synced successfully.");
        await fetchData();
        setTimeout(() => setSyncMessage(null), 4000);
        return { success: true, message: "Attendance synced successfully." };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to sync with MITS. Showing your last available attendance.";
      setSyncMessage(msg);
      setTimeout(() => setSyncMessage(null), 5000);
      return { success: false, message: msg };
    } finally {
      setSyncing(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id || id === 'all' ? { ...n, isRead: true } : n));
      if (id === 'all') setUnreadCount(0);
      else setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const updateTargetThreshold = async (newTarget) => {
    setTargetAttendance(newTarget);
    try {
      await axios.put('/api/student/profile', { targetAttendancePct: newTarget });
      fetchData();
    } catch (err) {
      console.error("Failed to update target percentage:", err);
    }
  };

  return (
    <AttendanceContext.Provider value={{
      subjects,
      overall,
      notifications,
      unreadCount,
      targetAttendance,
      loading,
      syncing,
      syncMessage,
      fetchData,
      syncAttendance,
      markNotificationRead,
      updateTargetThreshold
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
