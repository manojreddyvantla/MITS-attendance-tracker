const fs = require('fs');
const path = require('path');

const resPath = path.join(__dirname, 'mits_live_api_results.json');
const data = JSON.parse(fs.readFileSync(resPath, 'utf8'));
const dashboardStr = data['/gemsonline-student/dashboard.action?actionType=view'];

const lines = dashboardStr.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.format')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});
