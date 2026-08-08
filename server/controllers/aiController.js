/**
 * AI Controller
 * Manages ChatGPT-style AI conversation endpoints.
 */

const db = require('../config/db');
const { processAIChat } = require('../services/ai/aiService');
const { calculateCurrentAttendance } = require('../services/calculator/attendanceCalculator');

async function handleAIChat(req, res, next) {
  try {
    const { prompt, conversationId } = req.body;
    const userId = req.user.id;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: "Prompt is required." });
    }

    // 1. Fetch student info & user target attendance
    const users = await db.query(`SELECT roll_number, full_name, target_attendance_pct FROM users WHERE id = ?`, [userId]);
    const user = users[0] || { roll_number: req.user.rollNumber, full_name: req.user.fullName, target_attendance_pct: 75.0 };
    const targetPct = parseFloat(user.target_attendance_pct) || 75.0;

    // 2. Fetch live student attendance
    const attRows = await db.query(
      `SELECT subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage 
       FROM attendance WHERE student_id = ?`,
      [userId]
    );

    const subjects = attRows.map(r => ({
      subjectCode: r.subject_code,
      subjectName: r.subject_name,
      attendedClasses: r.attended_classes,
      absentClasses: r.absent_classes,
      totalClasses: r.total_classes,
      attendancePercentage: parseFloat(r.attendance_percentage) || calculateCurrentAttendance(r.attended_classes, r.total_classes)
    }));

    // 3. Obtain conversation or create new
    let convId = conversationId;
    if (!convId) {
      convId = `conv-${userId}-${Date.now()}`;
      await db.query(
        `INSERT INTO ai_conversations (id, user_id, title) VALUES (?, ?, ?)`,
        [convId, userId, prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt]
      );
    }

    // Save user message
    const userMsgId = `msg-u-${Date.now()}`;
    await db.query(
      `INSERT INTO ai_messages (id, conversation_id, sender, content) VALUES (?, ?, ?, ?)`,
      [userMsgId, convId, 'user', prompt]
    );

    // 4. Generate AI response
    const replyText = await processAIChat({
      prompt,
      student: { roll_number: user.roll_number, full_name: user.full_name },
      subjects,
      targetAttendance: targetPct
    });

    // Save assistant message
    const assistantMsgId = `msg-a-${Date.now()}`;
    await db.query(
      `INSERT INTO ai_messages (id, conversation_id, sender, content) VALUES (?, ?, ?, ?)`,
      [assistantMsgId, convId, 'assistant', replyText]
    );

    res.json({
      success: true,
      conversationId: convId,
      userMessage: { id: userMsgId, sender: 'user', content: prompt },
      assistantMessage: { id: assistantMsgId, sender: 'assistant', content: replyText }
    });
  } catch (err) {
    next(err);
  }
}

async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;
    const convs = await db.query(
      `SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      conversations: convs
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleAIChat,
  getConversations
};
