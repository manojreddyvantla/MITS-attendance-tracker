const http = require('https');

const data = JSON.stringify({
  rollNumber: '24691A3365',
  password: 'password123'
});

const options = {
  hostname: 'mits-attendance-tracker.vercel.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    if(json.token) {
      console.log("Got token! Fetching attendance...");
      fetchAttendance(json.token);
    } else {
      console.log("Login failed:", body);
    }
  });
});

req.write(data);
req.end();

function fetchAttendance(token) {
  const req2 = http.request({
    hostname: 'mits-attendance-tracker.vercel.app',
    port: 443,
    path: '/api/attendance/overall',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }, (res2) => {
    let body = '';
    res2.on('data', d => body += d);
    res2.on('end', () => {
      console.log("Overall Attendance:");
      const json = JSON.parse(body);
      console.log(JSON.stringify(json.subjects.filter(s => s.subjectCode === 'APTITUDE' || s.subjectCode === 'SOFTSKILLS'), null, 2));
    });
  });
  req2.end();
}
