const fs = require('fs');
const { parseGemsDashboard } = require('../services/mits/mitsParser');

try {
  const dashboardData = fs.readFileSync('./dashboard_parsed.json', 'utf8');
  const result = parseGemsDashboard(dashboardData, "");
  fs.writeFileSync('./parser_output.json', JSON.stringify(result.subjects, null, 2));
} catch (e) {
  fs.writeFileSync('./parser_output.json', JSON.stringify({error: e.message}));
}
