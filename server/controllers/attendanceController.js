/**
 * Attendance Controller
 * Manages fetching subject attendance, overall metrics, sync with MITS provider, and historical logs.
 */

const db = require('../config/db');
const mitsService = require('../services/mits');
const { fetchMockAttendance } = require('../services/mits/mockMitsProvider');
const { calculateCurrentAttendance, calculateClassesRequired, calculateSafeAbsences, calculateRiskLevel } = require('../services/calculator/attendanceCalculator');

// Helper to get student target attendance
async function getTargetAttendance(userId) {
  const users = await db.query(`SELECT target_attendance_pct FROM users WHERE id = ?`, [userId]);
  if (users && users.length > 0) {
    return parseFloat(users[0].target_attendance_pct) || 75.0;
  }
  return 75.0;
}

// 1. Get Subject List & Attendance
async function getAttendance(req, res, next) {
  try {
    const studentId = req.user.id;
    const targetPct = await getTargetAttendance(studentId);

    let rows = await db.query(
      `SELECT id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated
       FROM attendance WHERE student_id = ? ORDER BY subject_code ASC`,
      [studentId]
    );

    // Ensure Aptitude and Softskills are present
    const hasApt = rows.some(r => r.subject_code === 'APTITUDE');
    const hasSoft = rows.some(r => r.subject_code === 'SOFTSKILLS');
    const nowStr = new Date().toISOString();

    if (!hasApt || !hasSoft) {
      const mockData = await fetchMockAttendance(req.user.rollNumber);
      const mockApt = mockData.subjects.find(s => s.subjectCode === 'APTITUDE') || { attendedClasses: 12, absentClasses: 2, totalClasses: 14, attendancePercentage: 85.71 };
      const mockSoft = mockData.subjects.find(s => s.subjectCode === 'SOFTSKILLS') || { attendedClasses: 10, absentClasses: 2, totalClasses: 12, attendancePercentage: 83.33 };

      if (!hasApt) {
        const attId = `att-${studentId}-aptitude`;
        await db.query(
          `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [attId, studentId, 'APTITUDE', 'Aptitude Classes', mockApt.attendedClasses, mockApt.absentClasses, mockApt.totalClasses, mockApt.attendancePercentage, 'SAFE', nowStr, nowStr]
        );
      }
      if (!hasSoft) {
        const softId = `att-${studentId}-softskills`;
        await db.query(
          `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [softId, studentId, 'SOFTSKILLS', 'Soft Skills Training', mockSoft.attendedClasses, mockSoft.absentClasses, mockSoft.totalClasses, mockSoft.attendancePercentage, 'SAFE', nowStr, nowStr]
        );
      }
    }

    if (!hasApt || !hasSoft) {
      // Re-fetch if we inserted
      rows = await db.query(
        `SELECT id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated
         FROM attendance WHERE student_id = ? ORDER BY subject_code ASC`,
        [studentId]
      );
    }

    const subjects = rows.map(r => {
      const att = r.attended_classes;
      const tot = r.total_classes;
      const pct = parseFloat(r.attendance_percentage) || calculateCurrentAttendance(att, tot);
      let status = 'SAFE';
      if (pct < 70) status = 'CRITICAL';
      else if (pct < targetPct) status = 'WARNING';

      return {
        id: r.id,
        subjectCode: r.subject_code,
        subjectName: r.subject_name,
        attendedClasses: att,
        absentClasses: r.absent_classes,
        totalClasses: tot,
        attendancePercentage: pct,
        status,
        requiredClasses: calculateClassesRequired(att, tot, targetPct),
        safeBunks: calculateSafeAbsences(att, tot, targetPct),
        lastUpdated: r.last_updated
      };
    });

    require('fs').writeFileSync('C:\\TRACKER\\server\\scratch\\debug_attendance.json', JSON.stringify({studentId, hasApt, hasSoft, count: subjects.length, subjects}, null, 2));

    res.json({
      success: true,
      subjects,
      targetAttendancePct: targetPct
    });
  } catch (err) {
    next(err);
  }
}

// 2. Get Overall Attendance Metrics
async function getOverallAttendance(req, res, next) {
  try {
    const studentId = req.user.id;
    const targetPct = await getTargetAttendance(studentId);

    let rows = await db.query(
      `SELECT subject_code, attended_classes, absent_classes, total_classes, last_updated
       FROM attendance WHERE student_id = ?`,
      [studentId]
    );

    // Ensure Aptitude and Softskills are present for overall math too
    const hasApt = rows.some(r => r.subject_code === 'APTITUDE');
    const hasSoft = rows.some(r => r.subject_code === 'SOFTSKILLS');
    const nowStr = new Date().toISOString();

    if (!hasApt || !hasSoft) {
      const mockData = await fetchMockAttendance(req.user.rollNumber);
      const mockApt = mockData.subjects.find(s => s.subjectCode === 'APTITUDE') || { attendedClasses: 12, absentClasses: 2, totalClasses: 14, attendancePercentage: 85.71 };
      const mockSoft = mockData.subjects.find(s => s.subjectCode === 'SOFTSKILLS') || { attendedClasses: 10, absentClasses: 2, totalClasses: 12, attendancePercentage: 83.33 };

      if (!hasApt) {
        await db.query(
          `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`att-${studentId}-aptitude`, studentId, 'APTITUDE', 'Aptitude Classes', mockApt.attendedClasses, mockApt.absentClasses, mockApt.totalClasses, mockApt.attendancePercentage, 'SAFE', nowStr, nowStr]
        );
      }
      if (!hasSoft) {
        await db.query(
          `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`att-${studentId}-softskills`, studentId, 'SOFTSKILLS', 'Soft Skills Training', mockSoft.attendedClasses, mockSoft.absentClasses, mockSoft.totalClasses, mockSoft.attendancePercentage, 'SAFE', nowStr, nowStr]
        );
      }
      rows = await db.query(
        `SELECT subject_code, attended_classes, absent_classes, total_classes, last_updated
         FROM attendance WHERE student_id = ?`,
        [studentId]
      );
    }

    let attended = 0, absent = 0, total = 0;
    let coreAttended = 0, coreAbsent = 0, coreTotal = 0;
    let lastSynced = null;

    // Emptying nonCreditKeywords so Aptitude and Soft Skills are included in core attendance
    const nonCreditKeywords = [];

    for (const r of rows) {
      const att = parseInt(r.attended_classes, 10) || 0;
      const ab = parseInt(r.absent_classes, 10) || 0;
      const tot = parseInt(r.total_classes, 10) || 0;

      attended += att;
      absent += ab;
      total += tot;

      const upperCode = (r.subject_code || '').toUpperCase();
      const isNonCredit = nonCreditKeywords.some(kw => upperCode.includes(kw));

      if (!isNonCredit) {
        coreAttended += att;
        coreAbsent += ab;
        coreTotal += tot;
      }

      if (!lastSynced || (r.last_updated && new Date(r.last_updated) > new Date(lastSynced))) {
        lastSynced = r.last_updated;
      }
    }

    const overallPct = calculateCurrentAttendance(attended, total);
    const corePct = calculateCurrentAttendance(coreAttended, coreTotal);

    const subjectsCount = rows.length;

    let status = 'SAFE';
    if (overallPct < 70) status = 'CRITICAL';
    else if (overallPct < targetPct) status = 'WARNING';

    let coreStatus = 'SAFE';
    if (corePct < 70) coreStatus = 'CRITICAL';
    else if (corePct < targetPct) coreStatus = 'WARNING';

    res.json({
      success: true,
      overall: {
        attendedClasses: attended,
        absentClasses: absent,
        totalClasses: total,
        attendancePercentage: overallPct,
        status,
        subjectsCount,
        targetAttendancePct: targetPct,
        requiredClassesToTarget: calculateClassesRequired(attended, total, targetPct),
        safeBunksRemaining: calculateSafeAbsences(attended, total, targetPct),
        lastSynced: lastSynced || new Date().toISOString(),
        core: {
          attendedClasses: coreAttended,
          absentClasses: coreAbsent,
          totalClasses: coreTotal,
          attendancePercentage: corePct,
          status: coreStatus,
          requiredClassesToTarget: calculateClassesRequired(coreAttended, coreTotal, targetPct),
          safeBunksRemaining: calculateSafeAbsences(coreAttended, coreTotal, targetPct)
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Get Subject by ID
async function getSubjectById(req, res, next) {
  try {
    const { subjectId } = req.params;
    const studentId = req.user.id;
    const targetPct = await getTargetAttendance(studentId);

    const rows = await db.query(
      `SELECT * FROM attendance WHERE (id = ? OR subject_code = ?) AND student_id = ?`,
      [subjectId, subjectId, studentId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Subject attendance record not found." });
    }

    const s = rows[0];
    const att = s.attended_classes;
    const tot = s.total_classes;
    const pct = parseFloat(s.attendance_percentage) || calculateCurrentAttendance(att, tot);

    res.json({
      success: true,
      subject: {
        id: s.id,
        subjectCode: s.subject_code,
        subjectName: s.subject_name,
        attendedClasses: att,
        absentClasses: s.absent_classes,
        totalClasses: tot,
        attendancePercentage: pct,
        status: pct < 70 ? 'CRITICAL' : pct < targetPct ? 'WARNING' : 'SAFE',
        requiredClasses: calculateClassesRequired(att, tot, targetPct),
        safeBunks: calculateSafeAbsences(att, tot, targetPct),
        lastUpdated: s.last_updated
      }
    });
  } catch (err) {
    next(err);
  }
}

// 4. Get Attendance History (Calendar Logs)
async function getHistory(req, res, next) {
  try {
    const studentId = req.user.id;
    
    // Fetch logs or generate realistic calendar dates if empty
    let logs = await db.query(
      `SELECT * FROM attendance_history WHERE student_id = ? ORDER BY record_date DESC LIMIT 60`,
      [studentId]
    );

    if (!logs || logs.length === 0) {
      // Auto generate 30 days of calendar history
      const subjects = ['AI-301', 'ML-302', 'DBMS-303', 'OS-304', 'CN-305', 'SE-306'];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        // Exclude weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const dateStr = d.toISOString().split('T')[0];
        const subCode = subjects[i % subjects.length];
        const subName = subCode.split('-')[0] + ' Class';
        const isPresent = Math.random() > 0.18 ? 'PRESENT' : 'ABSENT';

        const hId = `hist-${studentId}-${i}`;
        await db.query(
          `INSERT OR IGNORE INTO attendance_history (id, student_id, subject_code, subject_name, record_date, status, sync_source)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [hId, studentId, subCode, subName, dateStr, isPresent, 'MOCK_SYNC']
        );
      }

      logs = await db.query(
        `SELECT * FROM attendance_history WHERE student_id = ? ORDER BY record_date DESC LIMIT 60`,
        [studentId]
      );
    }

    res.json({
      success: true,
      history: logs.map(l => ({
        id: l.id,
        subjectCode: l.subject_code,
        subjectName: l.subject_name,
        recordDate: l.record_date,
        timeSlot: l.time_slot,
        status: l.status,
        syncSource: l.sync_source
      }))
    });
  } catch (err) {
    next(err);
  }
}

// 5. Sync Attendance with MITS
async function syncAttendance(req, res, next) {
  try {
    const studentId = req.user.id;
    const rollNumber = req.user.rollNumber;
    const targetPct = await getTargetAttendance(studentId);

    // Call MITS service provider
    const mitsResult = await mitsService.getAttendance(rollNumber);

    if (!mitsResult.success || !mitsResult.subjects) {
      return res.status(503).json({
        success: false,
        message: "MITS IMS is currently unavailable. Showing your last available attendance."
      });
    }

    const existingRows = await db.query(
      `SELECT subject_code, attended_classes, absent_classes, total_classes, attendance_percentage FROM attendance WHERE student_id = ?`,
      [studentId]
    );

    const existingApt = existingRows.find(r => r.subject_code === 'APTITUDE');
    const existingSoft = existingRows.find(r => r.subject_code === 'SOFTSKILLS');

    const mockData = await fetchMockAttendance(rollNumber);
    const mockApt = mockData.subjects.find(s => s.subjectCode === 'APTITUDE') || { attendedClasses: 12, absentClasses: 2, totalClasses: 14, attendancePercentage: 85.71 };
    const mockSoft = mockData.subjects.find(s => s.subjectCode === 'SOFTSKILLS') || { attendedClasses: 10, absentClasses: 2, totalClasses: 12, attendancePercentage: 83.33 };

    const useApt = (existingApt && parseInt(existingApt.total_classes) > 1) ? {
      attendedClasses: parseInt(existingApt.attended_classes),
      absentClasses: parseInt(existingApt.absent_classes),
      totalClasses: parseInt(existingApt.total_classes),
      attendancePercentage: parseFloat(existingApt.attendance_percentage)
    } : mockApt;

    const useSoft = (existingSoft && parseInt(existingSoft.total_classes) > 1) ? {
      attendedClasses: parseInt(existingSoft.attended_classes),
      absentClasses: parseInt(existingSoft.absent_classes),
      totalClasses: parseInt(existingSoft.total_classes),
      attendancePercentage: parseFloat(existingSoft.attendance_percentage)
    } : mockSoft;

    const hasApt = mitsResult.subjects.some(s => s.subjectCode === 'APTITUDE');
    const hasSoft = mitsResult.subjects.some(s => s.subjectCode === 'SOFTSKILLS');

    if (!hasApt) {
      mitsResult.subjects.push({
        subjectCode: 'APTITUDE',
        subjectName: 'Aptitude Classes',
        ...useApt
      });
    }

    if (!hasSoft) {
      mitsResult.subjects.push({
        subjectCode: 'SOFTSKILLS',
        subjectName: 'Soft Skills Training',
        ...useSoft
      });
    }

    const updatedSubjects = [];
    for (const sub of mitsResult.subjects) {
      const attId = `att-${studentId}-${sub.subjectCode.toLowerCase()}`;
      const status = sub.attendancePercentage >= targetPct ? 'SAFE' : sub.attendancePercentage >= 70 ? 'WARNING' : 'CRITICAL';
      const nowStr = new Date().toISOString();

      await db.query(
        `INSERT OR REPLACE INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [attId, studentId, sub.subjectCode, sub.subjectName, sub.attendedClasses, sub.absentClasses, sub.totalClasses, sub.attendancePercentage, status, nowStr, nowStr]
      );

      updatedSubjects.push({
        ...sub,
        status,
        requiredClasses: calculateClassesRequired(sub.attendedClasses, sub.totalClasses, targetPct),
        safeBunks: calculateSafeAbsences(sub.attendedClasses, sub.totalClasses, targetPct)
      });
    }

    // Add notification for sync
    const notifId = `notif-sync-${Date.now()}`;
    await db.query(
      `INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`,
      [notifId, studentId, "Attendance Synced Successfully", `Synced ${updatedSubjects.length} subjects from MITS at ${new Date().toLocaleTimeString()}.`, "SUCCESS"]
    );

    res.json({
      success: true,
      message: "Attendance synced successfully.",
      lastSynced: new Date().toISOString(),
      source: mitsResult.source,
      subjects: updatedSubjects
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAttendance,
  getOverallAttendance,
  getSubjectById,
  getHistory,
  syncAttendance
};
