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

  // 1. Extract subject metadata (name, faculty, email) from SubDetails section
  const subjectMetadata = {};
  const subMetaRegex = /<span style = "font-size:12px">([0-9A-Za-z]+)<\/span>[\s\S]*?<span style = "font-size:12px">([^<]+)<\/span>[\s\S]*?<span style = "font-size:12px">\s*([A-Za-z\s]+)<\/br>Email:<a href="mailto:([^"]+)">/gi;
  let metaMatch;
  while ((metaMatch = subMetaRegex.exec(dashboardContent)) !== null) {
    const code = metaMatch[1].trim();
    subjectMetadata[code] = {
      name: metaMatch[2].trim(),
      faculty: metaMatch[3].trim(),
      email: metaMatch[4].trim()
    };
  }

  // 2. Extract Attendance Table Rows from SemesterActivity
  const subjects = [];
  const attRowRegex = /<span style = "font-size:12px">\s*([A-Za-z0-9]+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*55px[^"]*">\s*(\d+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*40px[^"]*">\s*(\d+)\s*<\/span>[\s\S]*?<span style = "[^"]*padding:\s*37px[^"]*">\s*([\d\.]+)\s*<\/span>/gi;

  let rowMatch;
  while ((rowMatch = attRowRegex.exec(dashboardContent)) !== null) {
    const code = rowMatch[1].trim();
    const attended = parseInt(rowMatch[2].trim(), 10);
    const total = parseInt(rowMatch[3].trim(), 10);
    const percentage = parseFloat(rowMatch[4].trim());
    const absent = Math.max(0, total - attended);

    const meta = subjectMetadata[code] || {};

    subjects.push({
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

