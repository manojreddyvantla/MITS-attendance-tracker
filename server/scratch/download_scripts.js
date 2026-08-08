const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MITS_BASE_URL = 'http://mitsims.in';

const scripts = [
  'script/common/register.js',
  'script/conn/connection.js',
  'script/common/parent.js',
  'script/common/message.js',
  'script/gems-online/common/initiator.js',
  'script/common/person.js',
  'script/common/grid.js',
  'script/common/menubar.js',
  'script/gems-online/students.js',
  'script/studentFeedBack.js',
  'script/fees.js',
  'script/placement.js'
];

async function downloadScripts() {
  for (const s of scripts) {
    try {
      const res = await axios.get(`${MITS_BASE_URL}/${s}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      const localName = path.basename(s);
      const outPath = path.join(__dirname, localName);
      fs.writeFileSync(outPath, res.data);
      console.log(`Saved ${s} -> ${localName} (${res.data.length} bytes)`);
    } catch (err) {
      console.error(`Failed ${s}:`, err.message);
    }
  }
}

downloadScripts();
