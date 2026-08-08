/**
 * Calculator Controller
 * API Endpoint for standalone/custom attendance calculations.
 */

const {
  calculateCurrentAttendance,
  calculateClassesRequired,
  calculateSafeAbsences,
  calculateFutureAttendance,
  calculateRiskLevel
} = require('../services/calculator/attendanceCalculator');

async function calculateAttendance(req, res, next) {
  try {
    const { attendedClasses, totalClasses, targetAttendancePct, futurePresent, futureAbsent } = req.body;

    if (attendedClasses === undefined || totalClasses === undefined) {
      return res.status(400).json({ success: false, message: "Attended classes and total classes are required." });
    }

    const attended = Math.max(0, parseInt(attendedClasses, 10) || 0);
    const total = Math.max(0, parseInt(totalClasses, 10) || 0);
    const target = Math.min(99.99, Math.max(1, parseFloat(targetAttendancePct) || 75.0));

    if (attended > total) {
      return res.status(400).json({ success: false, message: "Attended classes cannot exceed total classes." });
    }

    const currentPercentage = calculateCurrentAttendance(attended, total);
    const requiredClasses = calculateClassesRequired(attended, total, target);
    const safeBunks = calculateSafeAbsences(attended, total, target);

    let futureProjection = null;
    if (futurePresent !== undefined || futureAbsent !== undefined) {
      futureProjection = calculateFutureAttendance(attended, total, futurePresent || 0, futureAbsent || 0);
    }

    const riskLevel = calculateRiskLevel(currentPercentage, target);

    res.json({
      success: true,
      calculation: {
        attendedClasses: attended,
        totalClasses: total,
        targetAttendancePct: target,
        currentPercentage,
        requiredClasses,
        safeBunks,
        riskLevel,
        isAboveTarget: currentPercentage >= target,
        futureProjection
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  calculateAttendance
};
