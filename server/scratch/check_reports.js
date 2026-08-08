const fs = require('fs');
const path = require('path');

const batchIds = [3579, 3626, 3681, 3722, 3759];
for (const bId of batchIds) {
  const p = path.join(__dirname, `progress_report_${bId}.txt`);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p, 'utf8');
    console.log(`=== BATCH ${bId} ===`);
    if (data.includes('Progress Report is not Available')) {
      console.log("Not available");
    } else {
      console.log("Found data! Size:", data.length);
      console.log(data.substring(0, 500));
    }
  }
}
