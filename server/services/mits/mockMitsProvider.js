/**
 * MITS Provider
 * Returns realistic student attendance and syllabus data for MITS IMS.
 * Resolves exact pursuing year, branch, and syllabus from MITS Roll Number.
 */

const { resolveMitsRollDetails } = require('./mitsSyllabusResolver');

/**
 * Normalizes subject data to standard schema.
 */
function normalizeAttendance(subject) {
  const attended = parseInt(subject.attendedClasses, 10) || 0;
  const absent = parseInt(subject.absentClasses, 10) || 0;
  const total = parseInt(subject.totalClasses, 10) || (attended + absent);
  const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(2)) : 0;

  return {
    subjectCode: subject.subjectCode,
    subjectName: subject.subjectName,
    attendedClasses: attended,
    absentClasses: absent,
    totalClasses: total,
    attendancePercentage: percentage
  };
}

/**
 * Fetches student attendance & syllabus details for MITS.
 */
async function fetchMockAttendance(rollNumber) {
  const details = resolveMitsRollDetails(rollNumber);
  const normalized = details.subjects.map(normalizeAttendance);

  return {
    success: true,
    source: "MITS_SYLLABUS_SYNC",
    timestamp: new Date().toISOString(),
    rollNumber: details.rollNumber,
    pursuingYearText: details.pursuingYearText,
    branchName: details.branchName,
    regulation: details.regulation,
    subjects: normalized
  };
}

module.exports = {
  normalizeAttendance,
  fetchMockAttendance
};
