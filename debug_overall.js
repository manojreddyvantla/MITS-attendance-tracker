const db = require('./server/config/db');
const { fetchMockAttendance } = require('./server/services/mits/mockMitsProvider');

async function test() {
  await db.initDb();
  const studentId = 'usr-demo-1786093405045';
  const rollNumber = '24691A3365';
  
  let rows = await db.query(
    `SELECT subject_code, attended_classes, absent_classes, total_classes, last_updated
     FROM attendance WHERE student_id = ?`,
    [studentId]
  );

  const hasApt = rows.some(r => r.subject_code === 'APTITUDE');
  const hasSoft = rows.some(r => r.subject_code === 'SOFTSKILLS');
  const nowStr = new Date().toISOString();
  
  console.log("hasApt:", hasApt, "hasSoft:", hasSoft);

  if (!hasApt || !hasSoft) {
    try {
      const mockData = await fetchMockAttendance(rollNumber);
      const mockApt = mockData.subjects.find(s => s.subjectCode === 'APTITUDE') || { attendedClasses: 12, absentClasses: 2, totalClasses: 14, attendancePercentage: 85.71 };
      const mockSoft = mockData.subjects.find(s => s.subjectCode === 'SOFTSKILLS') || { attendedClasses: 10, absentClasses: 2, totalClasses: 12, attendancePercentage: 83.33 };

      if (!hasApt) {
        console.log("Inserting APTITUDE...", mockApt);
        await db.query(
          `INSERT INTO attendance (id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`att-${studentId}-aptitude`, studentId, 'APTITUDE', 'Aptitude Classes', mockApt.attendedClasses, mockApt.absentClasses, mockApt.totalClasses, mockApt.attendancePercentage, 'SAFE', nowStr, nowStr]
        );
      }
      
      console.log("Insert successful!");
    } catch(e) {
      console.error("ERROR:", e);
    }
  }
}

test();
