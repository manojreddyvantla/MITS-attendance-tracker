const fs = require('fs');
const path = require('path');

const resPath = path.join(__dirname, 'mits_live_api_results.json');
const data = JSON.parse(fs.readFileSync(resPath, 'utf8'));

const dashboardStr = data['/gemsonline-student/dashboard.action?actionType=view'];
console.log("Dashboard response length:", dashboardStr.length);

// Extract all subject entries
const subRegex = /<span style = "font-size:12px">([0-9A-Za-z]+)<\/span>[\s\S]*?<span style = "font-size:12px">([^<]+)<\/span>[\s\S]*?<span style = "font-size:12px">\s*([A-Za-z\s]+)<\/br>Email:<a href="mailto:([^"]+)">/gi;

let match;
const subjects = [];
while ((match = subRegex.exec(dashboardStr)) !== null) {
  subjects.push({
    code: match[1].trim(),
    name: match[2].trim(),
    faculty: match[3].trim(),
    email: match[4].trim()
  });
}

console.log("Extracted subjects count:", subjects.length);
console.log(JSON.stringify(subjects, null, 2));
