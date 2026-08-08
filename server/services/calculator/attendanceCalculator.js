/**
 * Attendance Calculator Engine
 * Performs exact integer math and percentage calculations for MITS Attendance AI.
 */

/**
 * Calculates current attendance percentage.
 * @param {number} attended - Number of classes attended
 * @param {number} total - Total number of classes held
 * @returns {number} Percentage rounded to 2 decimal places
 */
function calculateCurrentAttendance(attended, total) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);

  if (tot === 0) return 0;
  if (att > tot) return 100;

  const pct = (att / tot) * 100;
  return Number(pct.toFixed(2));
}

/**
 * Calculates the exact number of consecutive classes required to reach a target attendance percentage.
 * Formula: (Attended + X) / (Total + X) >= Target / 100
 * => Attended * 100 + 100 * X >= Target * Total + Target * X
 * => X * (100 - Target) >= Target * Total - 100 * Attended
 * => X >= (Target * Total - 100 * Attended) / (100 - Target)
 *
 * @param {number} attended - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} target - Target attendance percentage (e.g. 75)
 * @returns {number} Minimum consecutive classes needed (0 if already at/above target)
 */
function calculateClassesRequired(attended, total, target = 75) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const tgt = Math.min(99.99, Math.max(1, parseFloat(target) || 75));

  if (tot === 0) return 0;

  const currentPct = (att / tot) * 100;
  if (currentPct >= tgt) return 0;

  // Needed numerator: tgt * tot - 100 * att
  const numerator = tgt * tot - 100 * att;
  const denominator = 100 - tgt;

  if (denominator <= 0) return 0;

  const required = Math.ceil(numerator / denominator);
  return Math.max(0, required);
}

/**
 * Calculates the maximum number of consecutive classes a student can miss while remaining at or above target percentage.
 * Formula: Attended / (Total + Y) >= Target / 100
 * => 100 * Attended >= Target * Total + Target * Y
 * => Target * Y <= 100 * Attended - Target * Total
 * => Y <= (100 * Attended - Target * Total) / Target
 *
 * @param {number} attended - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} target - Target attendance percentage (e.g. 75)
 * @returns {number} Maximum safe bunks (0 if currently below target)
 */
function calculateSafeAbsences(attended, total, target = 75) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const tgt = Math.min(99.99, Math.max(1, parseFloat(target) || 75));

  if (tot === 0) return 0;

  const currentPct = (att / tot) * 100;
  if (currentPct < tgt) return 0;

  const numerator = 100 * att - tgt * tot;
  if (numerator < 0) return 0;

  const safe = Math.floor(numerator / tgt);
  return Math.max(0, safe);
}

/**
 * Calculates future projected attendance after attending `futurePresent` classes and missing `futureAbsent` classes.
 * @param {number} attended - Current attended
 * @param {number} total - Current total
 * @param {number} futurePresent - Future attended
 * @param {number} futureAbsent - Future absent
 * @returns {object} { newAttended, newTotal, newPercentage }
 */
function calculateFutureAttendance(attended, total, futurePresent = 0, futureAbsent = 0) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const fPres = Math.max(0, parseInt(futurePresent, 10) || 0);
  const fAbs = Math.max(0, parseInt(futureAbsent, 10) || 0);

  const newAttended = att + fPres;
  const newTotal = tot + fPres + fAbs;
  const newPercentage = calculateCurrentAttendance(newAttended, newTotal);

  return {
    newAttended,
    newTotal,
    newPercentage
  };
}

/**
 * Calculates attendance risk level based on current percentage and target.
 * @param {number} attendancePercentage - Attendance %
 * @param {number} target - Target % (default 75)
 * @returns {string} 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
 */
function calculateRiskLevel(attendancePercentage, target = 75) {
  const pct = parseFloat(attendancePercentage) || 0;
  const tgt = parseFloat(target) || 75;

  if (pct >= tgt + 5) return 'LOW'; // Safe margin (e.g. >= 80% when target is 75)
  if (pct >= tgt) return 'MEDIUM'; // On border (e.g. 75% - 79.99%)
  if (pct >= tgt - 5) return 'HIGH'; // Slightly below (e.g. 70% - 74.99%)
  return 'CRITICAL'; // Dangerously below (< 70%)
}

/**
 * Calculates projected attendance over next N classes assuming 100% attendance vs 50% attendance vs 0% attendance.
 */
function calculateProjectedAttendance(attended, total, upcomingClasses = 10) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const upcoming = Math.max(1, parseInt(upcomingClasses, 10) || 10);

  const bestCase = calculateCurrentAttendance(att + upcoming, tot + upcoming);
  const midCase = calculateCurrentAttendance(att + Math.floor(upcoming / 2), tot + upcoming);
  const worstCase = calculateCurrentAttendance(att, tot + upcoming);

  return {
    upcomingClasses: upcoming,
    bestCasePct: bestCase,
    midCasePct: midCase,
    worstCasePct: worstCase
  };
}

module.exports = {
  calculateCurrentAttendance,
  calculateClassesRequired,
  calculateSafeAbsences,
  calculateFutureAttendance,
  calculateRiskLevel,
  calculateProjectedAttendance
};
