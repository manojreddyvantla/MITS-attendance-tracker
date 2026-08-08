/**
 * Auth Controller
 * Targets live MITS portal http://mitsims.in/ for direct student credential verification and attendance retrieval.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../config/jwt');
const MitsAuth = require('../services/mits/mitsAuth');
const MitsAttendanceService = require('../services/mits/mitsAttendance');
const { resolveMitsRollDetails } = require('../services/mits/mitsSyllabusResolver');

const mitsAuth = new MitsAuth();
const mitsAttendanceService = new MitsAttendanceService();

// Seed or update student attendance from MITS portal
async function syncAndSaveMitsAttendance(studentId, rollNumber, mitsSubjects) {
  // Clear old attendance records to ensure only current live MITS subjects are displayed
  await db.query(`DELETE FROM attendance WHERE student_id = ?`, [studentId]);

  for (const sub of mitsSubjects) {
    const subId = `sub-${sub.subjectCode.toLowerCase()}`;
    await db.query(
      `INSERT INTO subjects (id, subject_code, subject_name, credits) VALUES (?, ?, ?, ?)`,
      [subId, sub.subjectCode, sub.subjectName, 3]
    );

    const attId = `att-${studentId}-${sub.subjectCode.toLowerCase()}`;
    const status = sub.attendancePercentage >= 75 ? 'SAFE' : sub.attendancePercentage >= 70 ? 'WARNING' : 'CRITICAL';
    const nowStr = new Date().toISOString();

    await db.query(
      `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [attId, studentId, sub.subjectCode, sub.subjectName, sub.attendedClasses, sub.absentClasses, sub.totalClasses, sub.attendancePercentage, status, nowStr, nowStr]
    );
  }

  const notifId = `notif-${Date.now()}`;
  await db.query(
    `INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`,
    [notifId, studentId, "MITS Portal Synced Successfully", `Retrieved ${mitsSubjects.length} courses from http://mitsims.in/ for Roll No ${rollNumber}.`, "SUCCESS"]
  );
}

// 1. Register User
async function register(req, res, next) {
  try {
    const { rollNumber, password, email, fullName } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({ success: false, message: "Roll Number and MITS Password are required." });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const rollMeta = resolveMitsRollDetails(cleanRoll);
    const cleanEmail = (email || `${cleanRoll.toLowerCase()}@mits.ac.in`).trim().toLowerCase();
    const displayName = fullName || `Student (${cleanRoll})`;

    // Verify password with MITS Portal
    const mitsCheck = await mitsAuth.authenticate(cleanRoll, password);
    if (!mitsCheck.success) {
      return res.status(401).json({ success: false, message: `MITS Portal (http://mitsims.in/): ${mitsCheck.message}` });
    }

    // Retrieve attendance from MITS portal
    const attResult = await mitsAttendanceService.fetchStudentAttendance(cleanRoll, password);
    const realStudentName = attResult.studentName || displayName;

    const userId = `usr-${cleanRoll.toLowerCase()}`;
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert or update User with real student name from MITS
    await db.query(
      `INSERT INTO users (id, roll_number, password_hash, email, full_name, role, mits_connected) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cleanRoll, passwordHash, cleanEmail, realStudentName, 'student', 1]
    );

    // Insert Student Profile
    await db.query(
      `INSERT INTO students (id, user_id, roll_number, full_name, department, semester, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, userId, cleanRoll, realStudentName, rollMeta.branchName, attResult.semesterTitle || rollMeta.pursuingYearText, '2024-2025']
    );

    if (attResult.success && attResult.subjects) {
      await syncAndSaveMitsAttendance(userId, cleanRoll, attResult.subjects);
    }

    const token = generateToken({ id: userId, rollNumber: cleanRoll, fullName: realStudentName });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: "Registered and synced live attendance from MITS Portal.",
      token,
      user: {
        id: userId,
        rollNumber: cleanRoll,
        fullName: realStudentName,
        email: cleanEmail,
        pursuingYearText: attResult.semesterTitle || rollMeta.pursuingYearText,
        branchName: rollMeta.branchName,
        regulation: rollMeta.regulation,
        targetAttendancePct: 75.0,
        darkMode: true
      }
    });
  } catch (err) {
    next(err);
  }
}

// 2. Login User with Direct MITS Portal Verification
async function login(req, res, next) {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({ success: false, message: "Roll number and password are required." });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const rollMeta = resolveMitsRollDetails(cleanRoll);

    // Direct Live Portal Verification against http://mitsims.in/studentLogin/studentLogin.action?personType=student
    const mitsCheck = await mitsAuth.authenticate(cleanRoll, password);

    if (!mitsCheck.success) {
      return res.status(401).json({
        success: false,
        message: `MITS Portal (http://mitsims.in/): ${mitsCheck.message}`
      });
    }

    // Live Sync Attendance & Profile from http://mitsims.in/
    const attResult = await mitsAttendanceService.fetchStudentAttendance(cleanRoll, password);
    const realStudentName = attResult.studentName || `Student (${cleanRoll})`;

    // Check if user exists in local DB
    const existing = await db.query(`SELECT * FROM users WHERE roll_number = ?`, [cleanRoll]);
    const userId = (existing && existing.length > 0 && existing[0].id) ? existing[0].id : `usr-${cleanRoll.toLowerCase()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const email = `${cleanRoll.toLowerCase()}@mits.ac.in`;

    if (!existing || existing.length === 0) {
      await db.query(
        `INSERT INTO users (id, roll_number, password_hash, email, full_name, role, mits_connected) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, cleanRoll, passwordHash, email, realStudentName, 'student', 1]
      );

      await db.query(
        `INSERT INTO students (id, user_id, roll_number, full_name, department, semester, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, userId, cleanRoll, realStudentName, rollMeta.branchName, attResult.semesterTitle || rollMeta.pursuingYearText, '2024-2025']
      );
    } else {
      await db.query(`UPDATE users SET password_hash = ?, full_name = ?, mits_connected = 1 WHERE id = ?`, [passwordHash, realStudentName, userId]);
      await db.query(`UPDATE students SET full_name = ?, semester = ? WHERE user_id = ?`, [realStudentName, attResult.semesterTitle || rollMeta.pursuingYearText, userId]);
    }

    if (attResult.success && attResult.subjects) {
      await syncAndSaveMitsAttendance(userId, cleanRoll, attResult.subjects);
    }

    const token = generateToken({ id: userId, rollNumber: cleanRoll, fullName: realStudentName });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login & MITS Portal Sync Successful.",
      token,
      user: {
        id: userId,
        rollNumber: cleanRoll,
        fullName: realStudentName,
        email: email,
        pursuingYearText: attResult.semesterTitle || rollMeta.pursuingYearText,
        branchName: rollMeta.branchName,
        regulation: rollMeta.regulation,
        targetAttendancePct: 75.0,
        darkMode: true,
        mitsConnected: true
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Logout
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully." });
}

// 4. Refresh token
async function refresh(req, res, next) {
  try {
    const user = req.user;
    const token = generateToken({ id: user.id, rollNumber: user.rollNumber, fullName: user.fullName });
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
}

// 5. Get current user
async function me(req, res, next) {
  try {
    const studentId = req.user.id;
    const rollNo = req.user.rollNumber || studentId;
    const users = await db.query(`SELECT * FROM users WHERE id = ?`, [studentId]);
    const u = (users && users.length > 0) ? users[0] : (await db.query(`SELECT * FROM users WHERE roll_number = ?`, [rollNo]))[0];

    if (!u) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    const rollMeta = resolveMitsRollDetails(u.roll_number);
    const resolvedName = u.full_name || req.user.fullName || `Student (${u.roll_number})`;

    // Check student table for real semester from live portal
    const studentRows = await db.query(`SELECT * FROM students WHERE user_id = ? OR roll_number = ?`, [studentId, rollNo]);
    const liveSemester = (studentRows && studentRows.length > 0 && studentRows[0].semester) 
      ? studentRows[0].semester 
      : rollMeta.pursuingYearText;
    const departmentName = (studentRows && studentRows.length > 0 && studentRows[0].department)
      ? studentRows[0].department
      : rollMeta.branchName;

    res.json({
      success: true,
      user: {
        id: u.id,
        rollNumber: u.roll_number,
        fullName: resolvedName,
        email: u.email,
        role: u.role || 'student',
        pursuingYearText: liveSemester,
        branchName: departmentName,
        regulation: rollMeta.regulation,
        targetAttendancePct: parseFloat(u.target_attendance_pct) || 75.0,
        darkMode: Boolean(u.dark_mode),
        mitsConnected: Boolean(u.mits_connected)
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  me
};
