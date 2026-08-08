/**
 * MITS Integration Service Provider Entry point
 */
const MitsAttendanceService = require('./mitsAttendance');
const { fetchMockAttendance, normalizeAttendance } = require('./mockMitsProvider');

const provider = new MitsAttendanceService(process.env.MITS_INTEGRATION_MODE || 'live');

module.exports = {
  getAttendance: (rollNumber, password) => provider.fetchStudentAttendance(rollNumber, password),
  fetchStudentAttendance: (rollNumber, password) => provider.fetchStudentAttendance(rollNumber, password),
  fetchMockAttendance,
  normalizeAttendance
};
