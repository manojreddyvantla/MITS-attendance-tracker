const fs = require('fs');
const path = require('path');

const dash = JSON.parse(fs.readFileSync(path.join(__dirname, 'dashboard_parsed.json'), 'utf8'));
const semAct = dash.formPanel.items[3];

console.log("=== Semester Activity Title ===");
console.log(semAct.title);

console.log("\n=== Semester Activity Items ===");
for (let i = 0; i < (semAct.items?.length || 0); i++) {
  const it = semAct.items[i];
  console.log(`\n--- Item ${i} ---`);
  console.log("xtype:", it.xtype, "id:", it.id);
  if (it.items) {
    const texts = it.items.map(sub => sub.value || sub.html || sub.text || '').filter(Boolean);
    console.log("Texts:", texts);
  }
}
