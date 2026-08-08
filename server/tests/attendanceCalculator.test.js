const assert = require('assert');
const {
  calculateCurrentAttendance,
  calculateClassesRequired,
  calculateSafeAbsences,
  calculateRiskLevel
} = require('../services/calculator/attendanceCalculator');

console.log('🧪 Starting Attendance Math Engine Verification Tests...\n');

// 1. Attendance above 75% (Attended 30/35 = 85.71%)
const test1Pct = calculateCurrentAttendance(30, 35);
assert.strictEqual(test1Pct, 85.71, "Test 1 Failed: Percentage calculation");
assert.strictEqual(calculateClassesRequired(30, 35, 75), 0, "Test 1 Failed: Required classes should be 0");
assert.strictEqual(calculateSafeAbsences(30, 35, 75), 5, "Test 1 Failed: Safe bunks should be 5");
console.log('✅ Test 1 Passed: Attendance above 75% (30/35 -> 85.71%, 5 Safe Bunks)');

// 2. Attendance exactly 75% (Attended 24/32 = 75%)
const test2Pct = calculateCurrentAttendance(24, 32);
assert.strictEqual(test2Pct, 75.0, "Test 2 Failed: Percentage calculation");
assert.strictEqual(calculateClassesRequired(24, 32, 75), 0, "Test 2 Failed: Required classes should be 0");
assert.strictEqual(calculateSafeAbsences(24, 32, 75), 0, "Test 2 Failed: Safe bunks should be 0");
console.log('✅ Test 2 Passed: Attendance exactly 75% (24/32 -> 75.00%, 0 Safe Bunks)');

// 3. Attendance below 75% (Attended 20/29 = 68.97%)
const test3Pct = calculateCurrentAttendance(20, 29);
assert.strictEqual(test3Pct, 68.97, "Test 3 Failed: Percentage calculation");
// (75 * 29 - 100 * 20) / (100 - 75) = (2175 - 2000) / 25 = 175 / 25 = 7
assert.strictEqual(calculateClassesRequired(20, 29, 75), 7, "Test 3 Failed: Required classes should be 7");
assert.strictEqual(calculateSafeAbsences(20, 29, 75), 0, "Test 3 Failed: Safe bunks should be 0 when below target");
console.log('✅ Test 3 Passed: Attendance below 75% (20/29 -> 68.97%, 7 Required Classes)');

// 4. Zero classes (0/0)
assert.strictEqual(calculateCurrentAttendance(0, 0), 0, "Test 4 Failed: Zero total classes");
assert.strictEqual(calculateClassesRequired(0, 0, 75), 0, "Test 4 Failed: Zero total required");
assert.strictEqual(calculateSafeAbsences(0, 0, 75), 0, "Test 4 Failed: Zero total safe");
console.log('✅ Test 4 Passed: Zero total classes edge case');

// 5. Zero attendance (0/10)
assert.strictEqual(calculateCurrentAttendance(0, 10), 0, "Test 5 Failed: Zero attendance percentage");
assert.strictEqual(calculateClassesRequired(0, 10, 75), 30, "Test 5 Failed: Required classes for 0/10 to reach 75%");
console.log('✅ Test 5 Passed: Zero attendance edge case');

// 6. Target 70% (Attended 60/100 = 60%)
// (70 * 100 - 6000) / (30) = 1000 / 30 = 33.33 => 34
assert.strictEqual(calculateClassesRequired(60, 100, 70), 34, "Test 6 Failed: Target 70% calculation");
console.log('✅ Test 6 Passed: Target 70% configuration');

// 7. Target 80% (Attended 70/100 = 70%)
// (80 * 100 - 7000) / (20) = 1000 / 20 = 50
assert.strictEqual(calculateClassesRequired(70, 100, 80), 50, "Test 7 Failed: Target 80% calculation");
console.log('✅ Test 7 Passed: Target 80% configuration');

// 8. Very low attendance (5/50 = 10%)
// (75 * 50 - 500) / 25 = (3750 - 500) / 25 = 3250 / 25 = 130
assert.strictEqual(calculateClassesRequired(5, 50, 75), 130, "Test 8 Failed: Very low attendance recovery");
console.log('✅ Test 8 Passed: Very low attendance recovery');

// 9. Risk level classifications
assert.strictEqual(calculateRiskLevel(88.5, 75), 'LOW');
assert.strictEqual(calculateRiskLevel(76.0, 75), 'MEDIUM');
assert.strictEqual(calculateRiskLevel(71.5, 75), 'HIGH');
assert.strictEqual(calculateRiskLevel(65.0, 75), 'CRITICAL');
console.log('✅ Test 9 Passed: Risk level categorization engine');

console.log('\n🎉 ALL 9 VERIFICATION TEST SUITES PASSED SUCCESSFULLY!\n');
