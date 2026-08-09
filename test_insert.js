const db = require('./server/config/db');

async function test() {
  await db.initDb();
  
  // Try to insert Aptitude and Softskills like attendanceController does
  const studentId = 'usr-demo-1786093405045';
  const nowStr = new Date().toISOString();
  
  console.log("Adding APTITUDE...");
  await db.query(
    `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [`att-${studentId}-aptitude`, studentId, 'APTITUDE', 'Aptitude Classes', 1, 0, 1, 100, 'SAFE', nowStr, nowStr]
  );
  
  console.log("Adding SOFTSKILLS...");
  await db.query(
    `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [`att-${studentId}-softskills`, studentId, 'SOFTSKILLS', 'Soft Skills Training', 1, 0, 1, 100, 'SAFE', nowStr, nowStr]
  );
  
  const rows = await db.query(
    `SELECT * FROM attendance WHERE student_id = ?`,
    [studentId]
  );
  
  console.log("ROWS AFTER INSERT:", rows);
}

test();
