const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/attendance/sync',
  method: 'POST',
  headers: {
    // Generate a valid token using auth logic
  }
};

// Instead of doing full HTTP, let's just use the controller directly!
const db = require('./server/config/db');
const { syncAttendance } = require('./server/controllers/attendanceController');

async function testSync() {
  await db.initDb();
  
  // Create a mock req and res
  const req = {
    user: {
      id: 'usr-demo-1786093405045',
      rollNumber: '24691A3365'
    }
  };
  
  const res = {
    status: function(code) { return this; },
    json: function(data) {
      console.log(JSON.stringify(data.subjects.filter(s => s.subjectCode === 'APTITUDE'), null, 2));
    }
  };
  
  const next = function(err) { console.error(err); };
  
  await syncAttendance(req, res, next);
}

testSync();
