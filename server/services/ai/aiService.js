/**
 * AI Service Layer for MITS Attendance AI
 * Connects to LLM API via process.env.AI_API_KEY or provides intelligent context-driven responses.
 */

const axios = require('axios');
const { analyzeAttendanceRisk } = require('../prediction/riskEngine');
const { calculateClassesRequired, calculateSafeAbsences, calculateFutureAttendance } = require('../calculator/attendanceCalculator');

/**
 * Intelligent Fallback Response Generator
 * Uses exact deterministic calculations and attendance context to answer student queries naturally.
 */
function generateContextualAIResponse(prompt, studentData, subjects = [], targetPct = 75) {
  const query = prompt.toLowerCase().trim();
  const analysis = analyzeAttendanceRisk(subjects, targetPct);
  const rollNumber = studentData?.roll_number || studentData?.rollNumber || "Student";
  const name = studentData?.full_name || studentData?.fullName || "Student";

  // Match subject names in prompt
  const matchedSubject = subjects.find(s => {
    const code = (s.subjectCode || s.subject_code || '').toLowerCase();
    const name = (s.subjectName || s.subject_name || '').toLowerCase();
    return query.includes(code) || query.includes(name) || (code.includes('dbms') && query.includes('dbms')) || (code.includes('ml') && query.includes('ml')) || (code.includes('ai') && query.includes('ai')) || (code.includes('os') && query.includes('os')) || (code.includes('cn') && query.includes('cn')) || (code.includes('se') && query.includes('se'));
  });

  // Query 1: Can I bunk / miss class?
  if (query.includes('bunk') || query.includes('miss') || query.includes('skip')) {
    if (matchedSubject) {
      const att = matchedSubject.attendedClasses || matchedSubject.attended_classes || 0;
      const tot = matchedSubject.totalClasses || matchedSubject.total_classes || 0;
      const pct = matchedSubject.attendancePercentage || matchedSubject.attendance_percentage || 0;
      const safe = calculateSafeAbsences(att, tot, targetPct);
      const req = calculateClassesRequired(att, tot, targetPct);

      if (safe > 0) {
        return `Your current ${matchedSubject.subjectName} (${matchedSubject.subjectCode}) attendance is ${pct}%. You can safely miss up to ${safe} class(es) while staying at or above your ${targetPct}% target. However, plan wisely to avoid dropping into the risk zone!`;
      } else {
        return `Your current ${matchedSubject.subjectName} (${matchedSubject.subjectCode}) attendance is ${pct}%, which is below/at your target. If you miss a class, your attendance will drop further. You need to attend the next ${req} consecutive class(es) to reach/maintain ${targetPct}%. I recommend attending!`;
      }
    } else {
      if (analysis.overallSafeBunks > 0) {
        return `Your overall attendance is ${analysis.overallAttendancePercentage}%. You have ${analysis.overallSafeBunks} safe bunk(s) available overall. Be careful with subjects near or below ${targetPct}%: ${analysis.subjectAnalysis.filter(s => s.attendancePercentage < targetPct).map(s => s.subjectCode).join(', ') || 'None'}.`;
      } else {
        return `Your overall attendance is ${analysis.overallAttendancePercentage}%, which is in the risk zone. You need ${analysis.overallRequiredClasses} consecutive classes across your subjects to recover above ${targetPct}%. Skipping classes right now is not recommended!`;
      }
    }
  }

  // Query 2: How many classes do I need to attend / reach target?
  if (query.includes('how many') && (query.includes('attend') || query.includes('need') || query.includes('reach'))) {
    if (matchedSubject) {
      const att = matchedSubject.attendedClasses || matchedSubject.attended_classes || 0;
      const tot = matchedSubject.totalClasses || matchedSubject.total_classes || 0;
      const pct = matchedSubject.attendancePercentage || matchedSubject.attendance_percentage || 0;
      const req = calculateClassesRequired(att, tot, targetPct);

      if (req === 0) {
        return `You are already at ${pct}% in ${matchedSubject.subjectName}, which meets your target of ${targetPct}%. Keep attending to maintain this buffer!`;
      }
      return `Your ${matchedSubject.subjectName} (${matchedSubject.subjectCode}) attendance is currently ${pct}%. You must attend the next ${req} consecutive class(es) to reach your target of ${targetPct}%.`;
    } else {
      return `To reach an overall target of ${targetPct}% (currently at ${analysis.overallAttendancePercentage}%), you need to attend ${analysis.overallRequiredClasses} consecutive classes overall.`;
    }
  }

  // Query 3: Lowest attendance / lowest subject
  if (query.includes('lowest') || query.includes('worst')) {
    const sorted = [...subjects].sort((a, b) => (a.attendancePercentage || a.attendance_percentage) - (b.attendancePercentage || b.attendance_percentage));
    if (sorted.length > 0) {
      const lowest = sorted[0];
      const att = lowest.attendedClasses || lowest.attended_classes || 0;
      const tot = lowest.totalClasses || lowest.total_classes || 0;
      const pct = lowest.attendancePercentage || lowest.attendance_percentage || 0;
      const req = calculateClassesRequired(att, tot, targetPct);
      return `Your lowest attendance subject is **${lowest.subjectName} (${lowest.subjectCode})** at **${pct}%** (${att}/${tot} classes). You need to attend the next ${req} classes to recover to ${targetPct}%.`;
    }
  }

  // Query 4: Which subject should I focus on?
  if (query.includes('focus') || query.includes('priority') || query.includes('attention')) {
    const criticals = subjects.filter(s => (s.attendancePercentage || s.attendance_percentage) < targetPct);
    if (criticals.length > 0) {
      const list = criticals.map(s => `• **${s.subjectName} (${s.subjectCode})**: ${s.attendancePercentage || s.attendance_percentage}%`).join('\n');
      return `Here are the subjects that need your immediate focus:\n\n${list}\n\nFocus on attending these classes continuously until your percentages cross ${targetPct}%.`;
    }
    return `Great news, ${name}! None of your subjects are below ${targetPct}%. Keep maintaining your current attendance schedule across all 6 subjects.`;
  }

  // Query 5: Show me summary / overview
  if (query.includes('summary') || query.includes('overview') || query.includes('status') || query.includes('report')) {
    const subSummary = subjects.map(s => `${s.subjectCode}: ${s.attendancePercentage || s.attendance_percentage}% (${s.attendedClasses || s.attended_classes}/${s.totalClasses || s.total_classes})`).join(' | ');
    return `📊 **Attendance Summary for ${name} (${rollNumber})**:\n- **Overall Attendance**: ${analysis.overallAttendancePercentage}%\n- **Total Attended**: ${analysis.totalAttended} / ${analysis.totalClasses} classes\n- **Overall Risk Level**: ${analysis.overallRiskLevel}\n\n**Subject Breakdown**:\n${subSummary}`;
  }

  // General fallback answer
  return `Hi ${name}! Based on your latest MITS sync data:\n• **Overall Attendance**: ${analysis.overallAttendancePercentage}%\n• **Target Threshold**: ${targetPct}%\n• **Status**: ${analysis.recommendation}\n\nYou can ask me specific questions like "Can I bunk DBMS?", "Which subject has lowest attendance?", or "How many classes do I need for ML?"`;
}

/**
 * Process AI chat request
 */
async function processAIChat({ prompt, student, subjects = [], targetAttendance = 75 }) {
  const apiKey = process.env.AI_API_KEY;

  // If external LLM API key is available, attempt API call
  if (apiKey && apiKey.trim() !== '') {
    try {
      const systemPrompt = `You are Attendance AI Assistant, an expert academic advisor for MITS (Madanapalle Institute of Technology & Science). 
You help students manage their attendance, calculate safe bunks, and predict risks.
Strict rule: Always use the exact numerical data provided below. Do not invent attendance numbers.
Student Info: Roll: ${student?.roll_number}, Name: ${student?.full_name}
Target Attendance: ${targetAttendance}%
Live Attendance Data: ${JSON.stringify(subjects)}`;

      // OpenAI or Gemini endpoint request simulation
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
    } catch (err) {
      console.warn("External LLM API call failed or timed out. Falling back to local intelligence engine:", err.message);
    }
  }

  // Fallback to local rule & calculation engine
  return generateContextualAIResponse(prompt, student, subjects, targetAttendance);
}

module.exports = {
  processAIChat,
  generateContextualAIResponse
};
