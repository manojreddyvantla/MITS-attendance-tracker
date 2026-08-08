const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const MITS_BASE_URL = 'http://mitsims.in';
const rollNumber = '24691A3365';
const password = 'Manojreddy65';

async function testLogin() {
  console.log("1. Fetching initial cookie from MITS...");
  let cookieHeader = '';
  try {
    const initRes = await axios.get(`${MITS_BASE_URL}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    const setCookies = initRes.headers['set-cookie'] || [];
    cookieHeader = Array.isArray(setCookies) ? setCookies.map(c => c.split(';')[0]).join('; ') : '';
    console.log("Initial cookies:", cookieHeader);
  } catch (err) {
    console.error("Failed initial GET:", err.message);
  }

  console.log("\n2. Sending login POST request...");
  const postData = querystring.stringify({
    userId: rollNumber,
    password: password
  });

  try {
    const loginRes = await axios.post(
      `${MITS_BASE_URL}/studentLogin/studentLogin.action?personType=student`,
      postData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/`,
          'Origin': MITS_BASE_URL,
          ...(cookieHeader && { 'Cookie': cookieHeader })
        },
        maxRedirects: 5,
        timeout: 15000,
        validateStatus: status => status < 500
      }
    );

    console.log("Login Response Status:", loginRes.status);
    console.log("Login Response Headers:", loginRes.headers);
    console.log("Login Response Data:", typeof loginRes.data === 'string' ? loginRes.data.substring(0, 500) : loginRes.data);

    const loginSetCookies = loginRes.headers['set-cookie'] || [];
    if (Array.isArray(loginSetCookies) && loginSetCookies.length > 0) {
      const newCookies = loginSetCookies.map(c => c.split(';')[0]).join('; ');
      cookieHeader = cookieHeader ? `${cookieHeader}; ${newCookies}` : newCookies;
    }
    console.log("Updated Cookie Header:", cookieHeader);

    // Try redirect / home
    console.log("\n3. Testing student redirect / home page...");
    const redirectRes = await axios.get(
      `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`,
      {
        headers: {
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/`
        },
        timeout: 15000,
        validateStatus: status => status < 500
      }
    );

    console.log("Redirect Status:", redirectRes.status);
    console.log("Redirect Data Preview (first 1000 chars):", typeof redirectRes.data === 'string' ? redirectRes.data.substring(0, 1000) : redirectRes.data);
    
    // Save to scratch file for inspection
    const outPath = path.join(__dirname, 'student_redirect_output.html');
    fs.writeFileSync(outPath, typeof redirectRes.data === 'string' ? redirectRes.data : JSON.stringify(redirectRes.data, null, 2));
    console.log("Saved response HTML to", outPath);

    // Let's also test other student endpoints to find all available data (attendance, marks, syllabus, etc.)
    const testEndpoints = [
      '/student/studentAttendance.action',
      '/student/attendanceDetails.action',
      '/student/getAttendanceDetails.action',
      '/student/studentInternalMarks.action',
      '/student/studentExternalMarks.action',
      '/student/studentProfile.action',
      '/student/studentDashboard.action',
      '/student/studentHome.action'
    ];

    for (const ep of testEndpoints) {
      try {
        console.log(`\nTesting endpoint: ${ep}...`);
        const epRes = await axios.get(`${MITS_BASE_URL}${ep}`, {
          headers: {
            'Cookie': cookieHeader,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`
          },
          timeout: 8000,
          validateStatus: status => status < 500
        });
        console.log(`Endpoint ${ep} Status:`, epRes.status, "Data len:", typeof epRes.data === 'string' ? epRes.data.length : 'obj');
        if (typeof epRes.data === 'string' && epRes.data.length > 50 && epRes.status === 200) {
          console.log(`Data snippet for ${ep}:`, epRes.data.substring(0, 300).replace(/\s+/g, ' '));
        }
      } catch (err) {
        console.log(`Endpoint ${ep} failed:`, err.message);
      }
    }

  } catch (err) {
    console.error("Login POST failed:", err.message);
  }
}

testLogin();
