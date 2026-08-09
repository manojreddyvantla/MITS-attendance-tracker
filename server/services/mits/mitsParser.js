/**
 * Advanced MITS GEMS HTML & Response Parser
 * Parses MITS GEMS ExtJS dashboard responses (containing SemesterActivity, SubDetails, and LeftSideBar),
 * extracts student full name, faculty details, and live attendance metrics.
 */

function parseStudentNameFromHTML(content) {
  if (!content) return '';

  if (typeof content === 'object') {
    return content.studName || content.studentName || content.userName || content.fullName || content.name || '';
  }

  if (typeof content === 'string') {
    // Check studName in JS/JSON
    const studMatch = content.match(/studName\s*:\s*['"]([^'"]+)['"]/i);
    if (studMatch && studMatch[1]) {
      return studMatch[1].trim();
    }

    // Try JSON match first
    try {
      const parsed = JSON.parse(content);
      if (parsed && (parsed.studName || parsed.studentName || parsed.userName || parsed.fullName || parsed.name)) {
        return parsed.studName || parsed.studentName || parsed.userName || parsed.fullName || parsed.name;
      }
    } catch (e) {}

    // Regex match in HTML for student name
    const patterns = [
      /Welcome\s*,?\s*<b>([^<]+)<\/b>/i,
      /Student\s*Name\s*[:|-]\s*<b>([^<]+)<\/b>/i,
      /class=["'](?:user-name|student-name|profile-name)["'][^>]*>([^<]+)</i,
      /Name\s*[:|-]\s*<\/td>\s*<td[^>]*>([^<]+)</i,
      /id=["'](?:stuName|studentName|userName|profileName)["'][^>]*>([^<]+)</i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1] && match[1].trim().length > 2) {
        return match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      }
    }
  }

  return '';
}

/**
 * Parses live GEMS ExtJS dashboard string or HTML response.
 * @param {string} dashboardContent - Data from /gemsonline-student/dashboard.action?actionType=view
 * @param {string} sidebarContent - Data from /gemsonline-student/getLeftSideBar.action
 */
function parseGemsDashboard(dashboardContent, sidebarContent = '') {
  if (!dashboardContent && !sidebarContent) return { subjects: [] };

  let studentName = parseStudentNameFromHTML(sidebarContent) || parseStudentNameFromHTML(dashboardContent);
  let instituteName = '';
  let semesterTitle = '';

  if (sidebarContent && typeof sidebarContent === 'string') {
    const instMatch = sidebarContent.match(/instituteName\s*:\s*['"]([^'"]+)['"]/i);
    if (instMatch) instituteName = instMatch[1].trim();
  }

  if (dashboardContent && typeof dashboardContent === 'string') {
    const semMatch = dashboardContent.match(/Semester Activity for-([^"'\n<]+)/i);
    if (semMatch) semesterTitle = semMatch[1].trim();
  }

  const subjectMetadata = {};
  const rawAttendance = [];

  let semIndex = dashboardContent.search(/['"]id['"]\s*:\s*['"]semesterActivity['"]/i);
  if (semIndex === -1) semIndex = dashboardContent.search(/Semester Activity for/i);

  const subDetailsData = semIndex !== -1 ? dashboardContent.substring(0, semIndex) : dashboardContent;
  const semActivityData = semIndex !== -1 ? dashboardContent.substring(semIndex) : dashboardContent;

  const extractSpans = (html) => {
    const s = [];
    const spanRegex = /<span[^>]*>(.*?)<\/span>/gi;
    let m;
    while ((m = spanRegex.exec(html)) !== null) {
      s.push(m[1]);
    }
    return s;
  };

  const processSpans = (spans, isAttendance) => {
    const codeIndices = [];
    for (let i = 0; i < spans.length; i++) {
      const txt = spans[i].replace(/<[^>]+>/g, '').trim();
      const upperTxt = txt.toUpperCase().replace(/\s+/g, ' ').trim();
      const exactHeaders = [
        'CODE', 'SUBJECT', 'SUBJECT CODE', 'SUBJECT NAME', 
        'FACULTY', 'FACULTY NAME', 'S.NO', 'CLASSES', 'CLASSES ATTENDED', 
        'TOTAL', 'TOTAL CLASSES CONDUCTED', 'CONDUCTED', 'ATTENDANCE', 'ATTENDANCE %',
        'THEORY', 'LAB', 'SEMESTER ACTIVITY', 'L T P C'
      ];
      const isHeader = exactHeaders.includes(upperTxt);
      
      // Valid subject codes can include spaces, ampersands, and dots, minimum 3 chars
      if (/^[A-Za-z0-9_\-\s&.]{3,40}$/.test(txt) && /[A-Za-z]/.test(txt) && !isHeader) {
        codeIndices.push({ index: i, code: txt });
      }
    }

    for (let c = 0; c < codeIndices.length; c++) {
      const start = codeIndices[c].index + 1;
      const end = c < codeIndices.length - 1 ? codeIndices[c+1].index : spans.length;
      const chunk = spans.slice(start, end);
      const code = codeIndices[c].code;

      if (chunk.length === 0) continue;

      if (!isAttendance) {
        // SubDetails parsing
        const name = chunk[0].replace(/<[^>]+>/g, '').trim();
        const facultySpan = chunk.find(s => s.includes('mailto:') || s.includes('Ext No:')) || (chunk.length > 1 ? chunk[1] : '');
        
        let faculty = '';
        let email = '';
        const emailMatch = facultySpan.match(/mailto:([^"]+)/i);
        if (emailMatch) {
          email = emailMatch[1].trim();
          faculty = facultySpan.replace(/<br\b[^>]*>[\s\S]*|Email:[\s\S]*/gi, '').replace(/<[^>]+>/g, '').trim();
        } else {
          faculty = facultySpan.replace(/<[^>]+>/g, '').trim(); 
        }

        if (!/^\s*\d+\s*$/.test(faculty)) {
          subjectMetadata[code] = { name, faculty, email };
        }
      } else {
        // SemesterActivity parsing
        const numericSpans = chunk.filter(s => {
          let t = s.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '');
          return /^\d+(\.\d+)?%?$/.test(t) || t === '0' || t === '-';
        });

        if (numericSpans.length >= 3) {
          let attended = 0, total = 0, percentage = 0;
          let foundValid = false;

          // Sliding window exact triplet match to handle extra columns (e.g. Section/Group)
          for (let j = 0; j <= numericSpans.length - 3; j++) {
            const n0 = parseFloat(numericSpans[j].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0;
            const n1 = parseFloat(numericSpans[j+1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0;
            const pct = parseFloat(numericSpans[j+2].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0;

            let isValid = false;
            if (n0 === 0 && pct === 0) {
              isValid = true;
            } else if (n1 > 0) {
              const diff1 = Math.abs((n0 / n1) * 100 - pct);
              const diff2 = Math.abs((n1 / n0) * 100 - pct);
              if (diff1 < 1.0 || diff2 < 1.0) isValid = true;
            }

            if (isValid) {
              if (n0 === 0 && pct === 0) {
                attended = 0; total = n1;
              } else {
                const diff1 = Math.abs((n0 / n1) * 100 - pct);
                const diff2 = Math.abs((n1 / n0) * 100 - pct);
                if (diff2 < diff1) {
                  attended = n1; total = n0;
                } else {
                  attended = n0; total = n1;
                }
              }
              percentage = pct;
              foundValid = true;
              break;
            }
          }

          if (!foundValid) {
            attended = parseInt(numericSpans[0].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ''), 10) || 0;
            total = parseInt(numericSpans[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ''), 10) || 0;
            percentage = parseFloat(numericSpans[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0;
          }

          const absent = Math.max(0, total - attended);
          
          // Overwrite if exists, so we always keep the last valid table's attendance
          const existingIdx = rawAttendance.findIndex(r => r.code === code);
          if (existingIdx >= 0) {
             rawAttendance[existingIdx] = { code, attended, total, absent, percentage };
          } else {
             rawAttendance.push({ code, attended, total, absent, percentage });
          }
        } else if (numericSpans.length > 0) {
          // If we found numbers but less than 3, grab whatever we can just in case!
          const attended = parseFloat(numericSpans[0].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0;
          const total = numericSpans.length > 1 ? (parseFloat(numericSpans[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, '')) || 0) : attended;
          const absent = Math.max(0, total - attended);
          rawAttendance.push({ code, attended, total, absent, percentage: 0 });
        }
      }
    }
  };

  processSpans(extractSpans(subDetailsData), false);
  processSpans(extractSpans(semActivityData), true);

  // Merge the metadata and attendance
  const subjects = [];
  for (const att of rawAttendance) {
    if (!subjects.find(s => s.subjectCode === att.code)) {
      const meta = subjectMetadata[att.code] || {};
      subjects.push({
        subjectCode: att.code,
        subjectName: meta.name || att.code,
        facultyName: meta.faculty || '',
        facultyEmail: meta.email || '',
        attendedClasses: att.attended,
        absentClasses: att.absent,
        totalClasses: att.total,
        attendancePercentage: att.percentage
      });
    }
  }

  // Include any subjects that were in SubDetails but had NO attendance row
  for (const code of Object.keys(subjectMetadata)) {
    if (!subjects.find(s => s.subjectCode === code)) {
      const meta = subjectMetadata[code];
      subjects.push({
        subjectCode: code,
        subjectName: meta.name || code,
        facultyName: meta.faculty || '',
        facultyEmail: meta.email || '',
        attendedClasses: 0,
        absentClasses: 0,
        totalClasses: 0,
        attendancePercentage: 0
      });
    }
  }

  return {
    studentName,
    instituteName,
    semesterTitle,
    subjects
  };
}

module.exports = {
  parseStudentNameFromHTML,
  parseGemsDashboard,
  parseAttendanceResponse: (content) => parseGemsDashboard(content).subjects,
  parseAttendanceHTML: (content) => parseGemsDashboard(content).subjects
};

