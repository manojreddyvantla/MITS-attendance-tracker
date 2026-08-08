const fs = require('fs');
const path = require('path');

const resPath = path.join(__dirname, 'mits_live_api_results.json');
const data = JSON.parse(fs.readFileSync(resPath, 'utf8'));

const sidebarStr = data['/gemsonline-student/getLeftSideBar.action'];
const dashboardStr = data['/gemsonline-student/dashboard.action?actionType=view'];

function parseGemsAttendance(dashboardStr, sidebarStr) {
  let studentName = '';
  let instituteName = '';
  
  if (sidebarStr) {
    const nameMatch = sidebarStr.match(/studName\s*:\s*['"]([^'"]+)['"]/i);
    if (nameMatch) studentName = nameMatch[1].trim();
    
    const instMatch = sidebarStr.match(/instituteName\s*:\s*['"]([^'"]+)['"]/i);
    if (instMatch) instituteName = instMatch[1].trim();
  }

  // Extract subjects metadata (names, faculty, emails) from SubDetails
  const subjectMetadata = {};
  const subMetaRegex = /<span style = "font-size:12px">([0-9A-Za-z]+)<\/span>[\s\S]*?<span style = "font-size:12px">([^<]+)<\/span>[\s\S]*?<span style = "font-size:12px">\s*([A-Za-z\s]+)<\/br>Email:<a href="mailto:([^"]+)">/gi;
  let metaMatch;
  while ((metaMatch = subMetaRegex.exec(dashboardStr)) !== null) {
    const code = metaMatch[1].trim();
    subjectMetadata[code] = {
      name: metaMatch[2].trim(),
      faculty: metaMatch[3].trim(),
      email: metaMatch[4].trim()
    };
  }

  // Extract semester title
  let semesterTitle = '';
  const semMatch = dashboardStr.match(/Semester Activity for-([^"'\n<]+)/i);
  if (semMatch) {
    semesterTitle = semMatch[1].trim();
  }

  // Extract Attendance Table Rows
  // Matches rows like:
  // Item containing S.NO, SUBJECT CODE, CLASSES ATTENDED, TOTAL CONDUCTED, ATTENDANCE %
  const attendanceList = [];
  
  // Regex to extract attendance rows from SemesterActivity
  // Matches: <span style = "font-size:12px">CODE</span> followed by attended, total, percentage
  const attRowRegex = /<span style = "font-size:12px">\s*([A-Za-z0-9]+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*55px[^"]*">\s*(\d+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*40px[^"]*">\s*(\d+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*37px[^"]*">\s*([\d\.]+)\s*<\/span>/gi;

  let rowMatch;
  while ((rowMatch = attRowRegex.exec(dashboardStr)) !== null) {
    const code = rowMatch[1].trim();
    const attended = parseInt(rowMatch[2].trim(), 10);
    const total = parseInt(rowMatch[3].trim(), 10);
    const percentage = parseFloat(rowMatch[4].trim());
    const absent = Math.max(0, total - attended);

    const meta = subjectMetadata[code] || {};

    attendanceList.push({
      subjectCode: code,
      subjectName: meta.name || code,
      facultyName: meta.faculty || '',
      facultyEmail: meta.email || '',
      attendedClasses: attended,
      absentClasses: absent,
      totalClasses: total,
      attendancePercentage: percentage
    });
  }

  // If the regex above missed any, use generic HTML table / fieldset parser fallback
  if (attendanceList.length === 0) {
    // Generic number pattern parser
    const fieldsetBlocks = dashboardStr.split(/xtype\s*:\s*['"]fieldset['"]/gi);
    for (const block of fieldsetBlocks) {
      if (block.includes('padding: 55px') || block.includes('padding: 37px') || block.includes('ATTENDANCE %')) {
        const spans = [];
        const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/gi;
        let sMatch;
        while ((sMatch = spanRegex.exec(block)) !== null) {
          const cleanText = sMatch[1].replace(/<[^>]+>/g, '').trim();
          if (cleanText) spans.push(cleanText);
        }
        
        if (spans.length >= 4) {
          const code = spans.find(s => /[A-Za-z0-9]{4,10}/.test(s) && isNaN(s));
          const nums = spans.map(s => parseFloat(s)).filter(n => !isNaN(n));
          if (code && nums.length >= 3) {
            const attended = Math.round(nums[0]);
            const total = Math.round(nums[1]);
            const pct = nums[2];
            if (total > 0) {
              const meta = subjectMetadata[code] || {};
              attendanceList.push({
                subjectCode: code,
                subjectName: meta.name || code,
                facultyName: meta.faculty || '',
                facultyEmail: meta.email || '',
                attendedClasses: attended,
                absentClasses: Math.max(0, total - attended),
                totalClasses: total,
                attendancePercentage: pct
              });
            }
          }
        }
      }
    }
  }

  return {
    studentName,
    instituteName,
    semesterTitle,
    subjects: attendanceList
  };
}

const parsed = parseGemsAttendance(dashboardStr, sidebarStr);
console.log("=== PARSED GEMS ATTENDANCE RESULT ===");
console.log("Student Name:", parsed.studentName);
console.log("Institute:", parsed.instituteName);
console.log("Semester:", parsed.semesterTitle);
console.log("Subjects Found:", parsed.subjects.length);
console.log(JSON.stringify(parsed.subjects, null, 2));
