const fs = require('fs');
const path = require('path');

const resPath = path.join(__dirname, 'mits_live_api_results.json');
const data = JSON.parse(fs.readFileSync(resPath, 'utf8'));
const dashboardStr = data['/gemsonline-student/dashboard.action?actionType=view'];

const sandbox = `
const Advaya = { Gms: { Student: { handler: { showFields: () => {}, ttWindow: () => {} } } } };
const Ext = {
  create: (cls, cfg) => cfg || {},
  String: {
    format: (format, ...args) => {
      return format;
    }
  },
  Date: {
    format: () => 'formatted_date',
    patterns: {}
  }
};
const result = (${dashboardStr});
module.exports = result;
`;

fs.writeFileSync(path.join(__dirname, 'eval_dash.js'), sandbox);

try {
  const dashObj = require('./eval_dash.js');
  console.log("Successfully evaluated dashboard response!");
  console.log("FormPanel items count:", dashObj.formPanel?.items?.length);
  const sections = [];
  for (let i = 0; i < (dashObj.formPanel?.items?.length || 0); i++) {
    const item = dashObj.formPanel.items[i];
    sections.push({
      index: i,
      id: item.id,
      xtype: item.xtype,
      title: item.title,
      hidden: item.hidden,
      childCount: item.items?.length
    });
  }
  console.log("Sections:", JSON.stringify(sections, null, 2));

  fs.writeFileSync(
    path.join(__dirname, 'dashboard_parsed.json'),
    JSON.stringify(dashObj, null, 2)
  );
  console.log("Saved clean dashboard_parsed.json!");
} catch (err) {
  console.error("Eval error:", err.message);
}
