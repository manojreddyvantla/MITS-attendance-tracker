const fs = require('fs');
const path = require('path');

const files = ['students.js', 'fees.js', 'studentFeedBack.js', 'parent.js', 'placement.js'];
const endpoints = new Set();

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/[\.\/a-zA-Z0-9_\-]+\.(action|srl|jsp|do)/g) || [];
    for (const m of matches) {
      endpoints.add(m);
    }
  }
}

console.log("Found endpoints:", Array.from(endpoints).sort());
