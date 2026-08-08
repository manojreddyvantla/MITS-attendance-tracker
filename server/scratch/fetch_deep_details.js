const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const MITS_BASE_URL = 'http://mitsims.in';
const rollNumber = '24691A3365';
const password = 'Manojreddy65';

async function fetchDetails() {
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

  // 1. Consolidated Transcript/Grades
  console.log("\n1. Fetching Consolidated View (Grades/CGPA)...");
  const postUsn = querystring.stringify({ usn: rollNumber });
  const scvRes = await axios.post(
    `${MITS_BASE_URL}/student/exec.action?actionType=scv&keyString=consolidate`,
    postUsn,
    {
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`
      }
    }
  );
  console.log("SCV Status:", scvRes.status, "SCV Length:", scvRes.data.length);
  fs.writeFileSync(path.join(__dirname, 'scv_consolidated_result.txt'), typeof scvRes.data === 'string' ? scvRes.data : JSON.stringify(scvRes.data, null, 2));

  // 2. Progress Reports for all semesters
  const batchIds = [3579, 3626, 3681, 3722, 3759];
  for (const bId of batchIds) {
    console.log(`\n2. Fetching Progress Report for batch ${bId}...`);
    const prRes = await axios.get(
      `${MITS_BASE_URL}/gemsonline-student/progressReport.action?batch.id=${bId}`,
      {
        headers: {
          'Cookie': cookieHeader,
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`
        }
      }
    );
    console.log(`Batch ${bId} Status:`, prRes.status, "Length:", prRes.data.length);
    fs.writeFileSync(path.join(__dirname, `progress_report_${bId}.txt`), typeof prRes.data === 'string' ? prRes.data : JSON.stringify(prRes.data, null, 2));
  }

  // 3. Assessment Marks
  for (const bId of batchIds) {
    console.log(`\n3. Fetching Assessment Marks for batch ${bId}...`);
    const amRes = await axios.get(
      `${MITS_BASE_URL}/gemsonline-student/getAssessmentMarks.action?&batch.id=${bId}`,
      {
        headers: {
          'Cookie': cookieHeader,
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `${MITS_BASE_URL}/studentLogin/studentReDirect.action?personType=student`
        }
      }
    );
    console.log(`Assessment ${bId} Status:`, amRes.status, "Length:", typeof amRes.data === 'string' ? amRes.data.length : 'obj');
    fs.writeFileSync(path.join(__dirname, `assessment_marks_${bId}.txt`), typeof amRes.data === 'string' ? amRes.data : JSON.stringify(amRes.data, null, 2));
  }
}

fetchDetails();
