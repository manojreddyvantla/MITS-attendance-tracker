const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

const MITS_BASE_URL = 'http://mitsims.in';

async function findMitsAttendanceUrl(rollNumber, password) {
  console.log(`Checking live MITS endpoints for Roll No: ${rollNumber}...`);

  try {
    // 1. Initial GET
    const initRes = await axios.get(`${MITS_BASE_URL}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const cookies = initRes.headers['set-cookie'] || [];
    const sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');

    // 2. Post login
    const postData = querystring.stringify({ userId: rollNumber, password: password });
    const loginRes = await axios.post(`${MITS_BASE_URL}/studentLogin/studentLogin.action?personType=student`, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': sessionCookie,
        'User-Agent': 'Mozilla/5.0',
        'Referer': `${MITS_BASE_URL}/`
      }
    });

    console.log('Login Response:', loginRes.data);

    // 3. Redirect GET
    const redirectRes = await axios.get(`${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`, {
      headers: {
        'Cookie': sessionCookie,
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const html = redirectRes.data;
    fs.writeFileSync('scratch_redirect.html', html, 'utf8');
    console.log('Saved studentReDirect.action HTML. Length:', html.length);

    // Extract all hrefs, actions, scripts from html
    const matches = html.match(/(?:href|action|url|src)\s*=\s*["']([^"']+)["']/gi) || [];
    console.log('\n--- ALL LINKS & ACTIONS IN STUDENT PORTAL ---');
    matches.forEach(m => {
      if (m.toLowerCase().includes('attend') || m.toLowerCase().includes('student') || m.toLowerCase().includes('academic') || m.toLowerCase().includes('report') || m.toLowerCase().includes('.action')) {
        console.log('  ->', m);
      }
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
}

const roll = process.argv[2] || '21691A0501';
const pass = process.argv[3] || 'mits1234';
findMitsAttendanceUrl(roll, pass);
