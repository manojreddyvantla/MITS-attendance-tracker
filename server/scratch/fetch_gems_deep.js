const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const MITS_BASE_URL = 'http://mitsims.in';
const rollNumber = '24691A3365';
const password = 'Manojreddy65';

async function fetchAllGemsData() {
  console.log("Authenticating...");
  let cookieHeader = '';
  const initRes = await axios.get(`${MITS_BASE_URL}/`, { timeout: 10000 });
  const setCookies = initRes.headers['set-cookie'] || [];
  cookieHeader = Array.isArray(setCookies) ? setCookies.map(c => c.split(';')[0]).join('; ') : '';

  const postData = querystring.stringify({
    userId: rollNumber,
    password: password
  });

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
      timeout: 10000
    }
  );

  const loginSetCookies = loginRes.headers['set-cookie'] || [];
  if (Array.isArray(loginSetCookies) && loginSetCookies.length > 0) {
    const newCookies = loginSetCookies.map(c => c.split(';')[0]).join('; ');
    cookieHeader = cookieHeader ? `${cookieHeader}; ${newCookies}` : newCookies;
  }

  const moreEndpoints = [
    '/gemsonline-student/getAssessmentMarks.action?&',
    '/gemsonline-student/progressReport.action?',
    '/gemsonline-student/getConsolidatedView.action',
    '/gemsonline-student/getAttendanceDetails.action',
    '/gemsonline-student/viewMyClassTtDetails.action',
    '/gemsonline-student/studentCertificateRequest.action?id=22960',
    '/gemsonline-student/getSemesters.action',
    '/gemsonline-student/getStudentAttendance.action',
    '/gemsonline-student/getAcademicAttendance.action'
  ];

  for (const ep of moreEndpoints) {
    try {
      console.log(`\nFetching ${ep}...`);
      const res = await axios.get(`${MITS_BASE_URL}${ep}`, {
        headers: {
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        validateStatus: () => true
      });
      console.log(`Status: ${res.status}, Type: ${typeof res.data}`);
      if (typeof res.data === 'string' && res.data.length < 5000) {
        console.log(`Response:`, res.data);
      } else if (typeof res.data === 'string') {
        console.log(`Response snippet (first 1000 chars):`, res.data.substring(0, 1000).replace(/\s+/g, ' '));
        fs.writeFileSync(path.join(__dirname, `${ep.replace(/[^a-zA-Z0-9]/g, '_')}.txt`), res.data);
      } else {
        console.log(`JSON:`, res.data);
      }
    } catch (e) {
      console.error(`Failed ${ep}:`, e.message);
    }
  }
}

fetchAllGemsData();
