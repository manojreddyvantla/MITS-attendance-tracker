const db = require('../config/db');

async function testAttendance() {
  try {
    const users = await db.query('SELECT id, roll_number FROM users WHERE roll_number = ?', ['24691A3365']);
    if (!users || users.length === 0) {
      console.log('User not found.');
      process.exit(0);
    }
    let studentId = users[0].id;

    // Wait, the attendance records might be saved under the literal string "usr-24691a3365" instead of the demo user ID due to a mock mismatch
    const attCheck = await db.query('SELECT count(*) as c FROM attendance WHERE student_id = ?', [studentId]);
    if (attCheck[0].c === 0) {
      studentId = 'usr-24691a3365'; // Fallback to the ID used in the attendance table
    }
    console.log(`Testing attendance for student: ${users[0].roll_number}\n`);

    const rows = await db.query(
      `SELECT subject_code, attended_classes, absent_classes, total_classes
       FROM attendance WHERE student_id = ?`,
      [studentId]
    );

    let attended = 0, total = 0;
    let oldCoreAttended = 0, oldCoreTotal = 0;
    let newCoreAttended = 0, newCoreTotal = 0;

    const oldNonCreditKeywords = ['APTITUDE', 'SOFTSKILL', 'SOFT SKILL'];

    console.log("SUBJECTS FOUND IN DB:");
    for (const r of rows) {
      const att = parseInt(r.attended_classes, 10) || 0;
      const tot = parseInt(r.total_classes, 10) || 0;
      
      attended += att;
      total += tot;

      const upperCode = (r.subject_code || '').toUpperCase();
      const isOldNonCredit = oldNonCreditKeywords.some(kw => upperCode.includes(kw));

      // Old math excluded them
      if (!isOldNonCredit) {
        oldCoreAttended += att;
        oldCoreTotal += tot;
      }

      // New math includes them
      newCoreAttended += att;
      newCoreTotal += tot;

      console.log(`- ${r.subject_code}: ${att}/${tot}`);
    }

    const calcPct = (a, t) => (t === 0 ? 0 : ((a / t) * 100).toFixed(2));

    console.log('\n=== ATTENDANCE RESULTS ===');
    console.log(`OLD Core Math (Training Excluded): ${oldCoreAttended} / ${oldCoreTotal} = ${calcPct(oldCoreAttended, oldCoreTotal)}%`);
    console.log(`NEW Core Math (Training Included): ${newCoreAttended} / ${newCoreTotal} = ${calcPct(newCoreAttended, newCoreTotal)}%`);
    console.log('==========================\n');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAttendance();
