/**
 * Prediction Controller
 * Analyzes attendance risk, subject trends, and predicts future outcomes.
 */

const db = require('../config/db');
const { analyzeAttendanceRisk } = require('../services/prediction/riskEngine');
const { calculateCurrentAttendance } = require('../services/calculator/attendanceCalculator');

async function predictAttendanceRisk(req, res, next) {
  try {
    const studentId = req.user.id;
    const { targetAttendancePct } = req.body;

    const users = await db.query(`SELECT target_attendance_pct FROM users WHERE id = ?`, [studentId]);
    const target = targetAttendancePct || (users[0] ? parseFloat(users[0].target_attendance_pct) : 75.0);

    const rows = await db.query(
      `SELECT subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage 
       FROM attendance WHERE student_id = ?`,
      [studentId]
    );

    const subjects = rows.map(r => ({
      subjectCode: r.subject_code,
      subjectName: r.subject_name,
      attendedClasses: r.attended_classes,
      absentClasses: r.absent_classes,
      totalClasses: r.total_classes,
      attendancePercentage: parseFloat(r.attendance_percentage) || calculateCurrentAttendance(r.attended_classes, r.total_classes)
    }));

    const analysis = analyzeAttendanceRisk(subjects, target);

    res.json({
      success: true,
      prediction: analysis
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  predictAttendanceRisk
};
