const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const MITS_BASE_URL = 'http://mitsims.in';
const rollNumber = '24691A3365';
const password = 'Manojreddy65';

async function testMitsStudentAPIs() {
  console.log("1. Authenticating...");
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
  console.log("Logged in! Cookie:", cookieHeader);

  // Endpoints discovered from gems-online student
  const endpoints = [
    '/gemsonline-student/getLeftSideBar.action',
    '/gemsonline-student/getHomeView.action',
    '/gemsonline-student/dashboard.action?actionType=view',
    '/gemsonline-student/getConsolidatedView.action',
    '/gemsonline-student/getLatestSem.action',
    '/gemsonline-student/getNotifications.action',
    '/gemsonline-student/myTimetable.action',
    '/gemsonline-student/profile.action',
    '/gemsonline-student/ls.action?actionType=confirmProfile',
    '/gemsonline-student/ls.action?actionType=view',
    '/gemsonline-student/ea.action',
    '/gemsonline-student/viewMyClassTtDetails.action'
  ];

  const results = {};

  for (const ep of endpoints) {
    try {
      console.log(`\nFetching ${ep}...`);
      const res = await axios.get(`${MITS_BASE_URL}${ep}`, {
        headers: {
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000
      });
      console.log(`Status: ${res.status}, Type: ${typeof res.data}`);
      results[ep] = res.data;
      if (typeof res.data === 'string') {
        console.log(`Preview (250 chars):`, res.data.substring(0, 250).replace(/\s+/g, ' '));
      } else {
        console.log(`JSON keys:`, Object.keys(res.data));
      }
    } catch (err) {
      console.error(`Error on ${ep}:`, err.message);
      results[ep] = { error: err.message };
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'mits_live_api_results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log("\nWrote results to mits_live_api_results.json");
}

testMitsStudentAPIs();
