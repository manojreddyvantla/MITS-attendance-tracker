const fs = require('fs');
const { parseGemsDashboard } = require('../services/mits/mitsParser');

const dashboardData = fs.readFileSync('./dashboard_parsed.json', 'utf8');

const result = parseGemsDashboard(dashboardData, "");
console.log(JSON.stringify(result.subjects, null, 2));
