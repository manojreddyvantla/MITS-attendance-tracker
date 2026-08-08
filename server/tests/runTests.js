/**
 * Test Runner Entrypoint
 */

console.log('==================================================');
console.log('  MITS Attendance AI - Backend Test Suite');
console.log('==================================================\n');

try {
  require('./attendanceCalculator.test');
  console.log('All backend tests executed cleanly with 0 errors.');
  process.exit(0);
} catch (err) {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
}
