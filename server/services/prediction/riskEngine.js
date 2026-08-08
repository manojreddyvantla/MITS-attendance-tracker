/**
 * Risk & Prediction Engine
 * Evaluates attendance risk levels, predicts future scenarios, and generates smart recommendations.
 */

const {
  calculateCurrentAttendance,
  calculateClassesRequired,
  calculateSafeAbsences,
  calculateRiskLevel
} = require('../calculator/attendanceCalculator');

/**
 * Analyzes overall & subject-level attendance to provide comprehensive risk insights.
 * @param {Array} subjects - List of subject attendance objects
 * @param {number} target - Target attendance percentage
 */
function analyzeAttendanceRisk(subjects = [], target = 75) {
  let totalAttended = 0;
  let totalClasses = 0;

  const subjectAnalysis = subjects.map(sub => {
    const att = sub.attendedClasses || sub.attended_classes || 0;
    const tot = sub.totalClasses || sub.total_classes || 0;
    const abs = sub.absentClasses || sub.absent_classes || (tot - att);
    const pct = calculateCurrentAttendance(att, tot);

    totalAttended += att;
    totalClasses += tot;

    const risk = calculateRiskLevel(pct, target);
    const requiredToTarget = calculateClassesRequired(att, tot, target);
    const safeBunks = calculateSafeAbsences(att, tot, target);

    let status = 'SAFE';
    if (pct < 70) status = 'CRITICAL';
    else if (pct < target) status = 'WARNING';

    return {
      subjectCode: sub.subjectCode || sub.subject_code,
      subjectName: sub.subjectName || sub.subject_name,
      attendedClasses: att,
      absentClasses: abs,
      totalClasses: tot,
      attendancePercentage: pct,
      status,
      riskLevel: risk,
      requiredClasses: requiredToTarget,
      safeBunks
    };
  });

  const overallPct = calculateCurrentAttendance(totalAttended, totalClasses);
  const overallRisk = calculateRiskLevel(overallPct, target);
  const overallRequired = calculateClassesRequired(totalAttended, totalClasses, target);
  const overallSafeBunks = calculateSafeAbsences(totalAttended, totalClasses, target);

  // Group high risk subjects
  const criticalSubjects = subjectAnalysis.filter(s => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH');
  const safeSubjects = subjectAnalysis.filter(s => s.riskLevel === 'LOW');

  // Generate recommendation summary
  let recommendation = '';
  if (criticalSubjects.length > 0) {
    const topCritical = criticalSubjects[0];
    recommendation = `Priority Alert: Your ${topCritical.subjectName} (${topCritical.subjectCode}) attendance is ${topCritical.attendancePercentage}%. Attend the next ${topCritical.requiredClasses} consecutive classes in ${topCritical.subjectCode} to reach your ${target}% target.`;
  } else if (overallPct < target) {
    recommendation = `Your overall attendance is ${overallPct}%, which is below the ${target}% target. Attend the next ${overallRequired} consecutive classes across all subjects to recover.`;
  } else {
    recommendation = `Great job! Your overall attendance is ${overallPct}%, exceeding your ${target}% target. You have ${overallSafeBunks} safe bunks remaining overall.`;
  }

  return {
    overallAttendancePercentage: overallPct,
    overallRiskLevel: overallRisk,
    overallRequiredClasses: overallRequired,
    overallSafeBunks: overallSafeBunks,
    totalAttended,
    totalAbsent: totalClasses - totalAttended,
    totalClasses,
    targetAttendance: target,
    criticalCount: criticalSubjects.length,
    subjectAnalysis,
    recommendation
  };
}

module.exports = {
  analyzeAttendanceRisk
};
