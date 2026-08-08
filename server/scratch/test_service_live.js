const MitsAttendanceService = require('../services/mits/mitsAttendance');

async function testService() {
  const service = new MitsAttendanceService();
  const result = await service.fetchStudentAttendance('24691A3365', 'Manojreddy65');
  console.log("=== SERVICE RESULT ===");
  console.log("Success:", result.success);
  console.log("Source:", result.source);
  console.log("Student Name:", result.studentName);
  console.log("Institute:", result.instituteName);
  console.log("Semester:", result.semesterTitle);
  console.log("Subjects count:", result.subjects?.length);
  console.log("Subjects:", JSON.stringify(result.subjects, null, 2));
}

testService();
