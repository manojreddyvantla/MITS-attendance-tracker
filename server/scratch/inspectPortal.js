const axios = require('axios');
const MitsAuth = require('../services/mits/mitsAuth');
const { parseAttendanceHTML } = require('../services/mits/mitsParser');

async function inspectMitsPortal(rollNumber, password) {
  console.log(`Inspecting portal for ${rollNumber}...`);
  const auth = new MitsAuth();
  const authRes = await auth.authenticate(rollNumber, password);

  console.log('Auth Result:', authRes);
  if (!authRes.success) return;

  const cookie = authRes.cookies;

  try {
    const redirectRes = await axios.get('http://mitsims.in/studentLogin/studentReDirect.action?personType=student', {
      headers: { 'Cookie': cookie, 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('Redirect Status:', redirectRes.status);
    console.log('Redirect HTML length:', redirectRes.data.length);

    // Search for links or actions inside HTML
    const html = redirectRes.data;
    const links = html.match(/(?:href|action|src)=["']([^"']+)["']/gi) || [];
    console.log('Found Links/Actions in redirect page:');
    links.forEach(l => console.log('  ', l));

    // Try parsing subjects from redirect HTML directly
    const parsed = parseAttendanceHTML(html);
    console.log('Parsed subjects from redirect HTML:', parsed);

  } catch (err) {
    console.error('Error inspecting portal:', err.message);
  }
}

// Test script
const roll = process.argv[2] || '21691A0501';
const pass = process.argv[3] || 'mits1234';
inspectMitsPortal(roll, pass);
