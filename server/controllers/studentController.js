/**
 * Student Controller
 * Manages profile information and application settings.
 */

const db = require('../config/db');

// Get Profile
async function getProfile(req, res, next) {
  try {
    const students = await db.query(
      `SELECT s.*, u.email, u.target_attendance_pct, u.dark_mode 
       FROM students s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = ?`,
      [req.user.id]
    );

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, message: "Student profile not found." });
    }

    const s = students[0];
    res.json({
      success: true,
      profile: {
        id: s.id,
        rollNumber: s.roll_number,
        fullName: s.full_name,
        department: s.department,
        year: s.year,
        semester: s.semester,
        section: s.section,
        academicYear: s.academic_year,
        email: s.email,
        targetAttendancePct: parseFloat(s.target_attendance_pct) || 75.0,
        darkMode: Boolean(s.dark_mode)
      }
    });
  } catch (err) {
    next(err);
  }
}

// Update Profile & Settings
async function updateProfile(req, res, next) {
  try {
    const { fullName, email, targetAttendancePct, darkMode } = req.body;
    const userId = req.user.id;

    if (fullName) {
      await db.query(`UPDATE users SET full_name = ? WHERE id = ?`, [fullName, userId]);
      await db.query(`UPDATE students SET full_name = ? WHERE user_id = ?`, [fullName, userId]);
    }

    if (email) {
      await db.query(`UPDATE users SET email = ? WHERE id = ?`, [email, userId]);
    }

    if (targetAttendancePct !== undefined) {
      const tgt = Math.min(95, Math.max(50, parseFloat(targetAttendancePct) || 75.0));
      await db.query(`UPDATE users SET target_attendance_pct = ? WHERE id = ?`, [tgt, userId]);
    }

    if (darkMode !== undefined) {
      await db.query(`UPDATE users SET dark_mode = ? WHERE id = ?`, [darkMode ? 1 : 0, userId]);
    }

    res.json({
      success: true,
      message: "Profile updated successfully."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
