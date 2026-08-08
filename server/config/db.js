/**
 * Database Configuration & Abstraction Layer
 * Supports MySQL (via mysql2) and a pure JavaScript file store fallback.
 * Guarantees 100% cross-platform zero-config runnability on Windows/Mac/Linux.
 */

const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

let dbDriver = 'json'; // Default fallback driver
let mysqlPool = null;
let jsonStore = {
  users: [],
  students: [],
  subjects: [],
  attendance: [],
  attendance_history: [],
  notifications: [],
  ai_conversations: [],
  ai_messages: [],
  refresh_tokens: []
};

const jsonDbPath = path.join(__dirname, '..', 'data', 'mits_attendance.json');

// Initialize JSON file store
function initJsonStore() {
  const dbDir = path.dirname(jsonDbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(jsonDbPath)) {
    try {
      const data = fs.readFileSync(jsonDbPath, 'utf8');
      jsonStore = { ...jsonStore, ...JSON.parse(data) };
    } catch (e) {
      console.warn("Could not load existing JSON store, reinitializing:", e.message);
    }
  } else {
    persistJsonStore();
  }
}

function persistJsonStore() {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(jsonStore, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to persist JSON database store:", e.message);
  }
}

// MySQL Init Attempt
async function initDb() {
  if (process.env.USE_MYSQL === 'true') {
    try {
      const dbConfig = {
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'mits_attendance',
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306
      };
      mysqlPool = mysql.createPool(dbConfig);
      const connection = await mysqlPool.getConnection();
      console.log("✅ Connected to MySQL Database:", dbConfig.database);
      connection.release();
      dbDriver = 'mysql';
      return;
    } catch (err) {
      console.warn("⚠️ MySQL server not detected. Using embedded pure-JS file store.");
    }
  }

  dbDriver = 'json';
  initJsonStore();
  console.log("✅ Pure-JS JSON Data Store initialized at:", jsonDbPath);
}

/**
 * Universal Query Engine
 */
async function query(sql, params = []) {
  if (dbDriver === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  }

  if (!jsonStore.users) initJsonStore();

  const trimmed = sql.trim();

  // Helper matching logic for simple queries
  // 1. SELECT * FROM table WHERE col = ?
  if (/^SELECT/i.test(trimmed)) {
    const fromMatch = trimmed.match(/FROM\s+([a-z_]+)/i);
    if (!fromMatch) return [];

    const tableName = fromMatch[1].toLowerCase();
    let records = jsonStore[tableName] || [];

    // WHERE clause evaluation
    if (/WHERE/i.test(trimmed)) {
      if (/roll_number\s*=\s*\?/i.test(trimmed)) {
        records = records.filter(r => (r.roll_number || r.rollNumber || '').toLowerCase() === String(params[0]).toLowerCase());
      } else if (/user_id\s*=\s*\?/i.test(trimmed)) {
        records = records.filter(r => (r.user_id || r.userId) === params[0]);
      } else if (/student_id\s*=\s*\?/i.test(trimmed)) {
        records = records.filter(r => (r.student_id || r.studentId) === params[0]);
      } else if (/id\s*=\s*\?/i.test(trimmed)) {
        records = records.filter(r => r.id === params[0]);
      } else if (/conversation_id\s*=\s*\?/i.test(trimmed)) {
        records = records.filter(r => (r.conversation_id || r.conversationId) === params[0]);
      }
    }

    // Aggregations support
    if (/SUM\(/i.test(trimmed) && /attendance/i.test(tableName)) {
      const studentId = params[0];
      const studentRecords = (jsonStore.attendance || []).filter(r => r.student_id === studentId);
      const totalAttended = studentRecords.reduce((acc, curr) => acc + (curr.attended_classes || 0), 0);
      const totalAbsent = studentRecords.reduce((acc, curr) => acc + (curr.absent_classes || 0), 0);
      const totalClasses = studentRecords.reduce((acc, curr) => acc + (curr.total_classes || 0), 0);
      const lastSynced = studentRecords.length > 0 ? studentRecords[0].last_updated : new Date().toISOString();

      return [{
        total_attended: totalAttended,
        total_absent: totalAbsent,
        total_classes: totalClasses,
        last_synced: lastSynced
      }];
    }

    if (/COUNT\(\*\)\s+as\s+count/i.test(trimmed)) {
      return [{ count: records.length }];
    }

    return records;
  }

  // 2. INSERT OR REPLACE / INSERT INTO / UPDATE / DELETE
  if (/^INSERT|^UPDATE|^DELETE/i.test(trimmed)) {
    const tableMatch = trimmed.match(/(?:INTO|UPDATE|FROM)\s+([a-z_]+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1].toLowerCase();
      if (!jsonStore[tableName]) jsonStore[tableName] = [];

      if (/DELETE/i.test(trimmed)) {
        if (/student_id\s*=\s*\?/i.test(trimmed)) {
          const studentId = params[0];
          jsonStore[tableName] = jsonStore[tableName].filter(r => (r.student_id || r.userId) !== studentId);
        } else if (/id\s*=\s*\?/i.test(trimmed)) {
          const idVal = params[0];
          jsonStore[tableName] = jsonStore[tableName].filter(r => r.id !== idVal);
        } else {
          jsonStore[tableName] = [];
        }
      } else if (/INSERT/i.test(trimmed)) {
        if (tableName === 'users') {
          const [id, roll_number, password_hash, email, full_name, role] = params;
          jsonStore.users = jsonStore.users.filter(u => u.roll_number !== roll_number && u.id !== id);
          const newObj = { id, roll_number, password_hash, email, full_name, role, target_attendance_pct: 75.0, dark_mode: 1 };
          jsonStore.users.push(newObj);
        } else if (tableName === 'students') {
          const [id, user_id, roll_number, full_name, department, year, semester] = params;
          jsonStore.students = jsonStore.students.filter(s => s.roll_number !== roll_number && s.user_id !== user_id);
          const newObj = { id, user_id, roll_number, full_name, department: department || 'Computer Science & Engineering (AI & ML)', year: year || 3, semester: semester || 6 };
          jsonStore.students.push(newObj);
        } else if (tableName === 'subjects') {
          const [id, subject_code, subject_name, credits] = params;
          jsonStore.subjects = jsonStore.subjects.filter(s => s.subject_code !== subject_code);
          jsonStore.subjects.push({ id, subject_code, subject_name, credits: credits || 3 });
        } else if (tableName === 'attendance') {
          const [id, student_id, subject_code, subject_name, attended_classes, absent_classes, total_classes, attendance_percentage, status, last_updated] = params;
          jsonStore.attendance = jsonStore.attendance.filter(a => !(a.student_id === student_id && a.subject_code === subject_code));
          jsonStore.attendance.push({
            id, student_id, subject_code, subject_name,
            attended_classes, absent_classes, total_classes,
            attendance_percentage, status, last_updated: last_updated || new Date().toISOString()
          });
        } else if (tableName === 'notifications') {
          const [id, user_id, title, message, type] = params;
          jsonStore.notifications.unshift({ id, user_id, title, message, type: type || 'INFO', is_read: 0, created_at: new Date().toISOString() });
        } else if (tableName === 'attendance_history') {
          const [id, student_id, subject_code, subject_name, record_date, status, sync_source] = params;
          jsonStore.attendance_history.push({ id, student_id, subject_code, subject_name, record_date, status, sync_source });
        } else if (tableName === 'ai_conversations') {
          const [id, user_id, title] = params;
          jsonStore.ai_conversations.unshift({ id, user_id, title, updated_at: new Date().toISOString() });
        } else if (tableName === 'ai_messages') {
          const [id, conversation_id, sender, content] = params;
          jsonStore.ai_messages.push({ id, conversation_id, sender, content, created_at: new Date().toISOString() });
        }
      } else if (/UPDATE/i.test(trimmed)) {
        const whereVal = params[params.length - 1];
        const match = trimmed.match(/SET\s+([\s\S]+?)\s+WHERE/i);
        const updates = {};
        if (match) {
          const setFields = match[1].split(',').map(s => s.trim().split('=')[0].trim().toLowerCase());
          setFields.forEach((f, idx) => {
            if (params[idx] !== undefined) {
              updates[f] = params[idx];
            }
          });
        }

        if (tableName === 'users') {
          jsonStore.users = jsonStore.users.map(u => {
            if (u.id === whereVal || u.roll_number === whereVal) {
              if (updates['full_name'] !== undefined) u.full_name = updates['full_name'];
              if (updates['password_hash'] !== undefined) u.password_hash = updates['password_hash'];
              if (updates['email'] !== undefined) u.email = updates['email'];
              if (updates['target_attendance_pct'] !== undefined) u.target_attendance_pct = updates['target_attendance_pct'];
              if (updates['dark_mode'] !== undefined) u.dark_mode = updates['dark_mode'];
              if (updates['mits_connected'] !== undefined) u.mits_connected = 1;
            }
            return u;
          });
        } else if (tableName === 'students') {
          jsonStore.students = jsonStore.students.map(s => {
            if (s.user_id === whereVal || s.roll_number === whereVal) {
              if (updates['full_name'] !== undefined) s.full_name = updates['full_name'];
              if (updates['semester'] !== undefined) s.semester = updates['semester'];
              if (updates['department'] !== undefined) s.department = updates['department'];
            }
            return s;
          });
        } else if (tableName === 'notifications') {
          jsonStore.notifications = jsonStore.notifications.map(n => {
            if (n.user_id === whereVal || whereVal === 'all' || n.id === whereVal) {
              n.is_read = 1;
            }
            return n;
          });
        }
      }

      persistJsonStore();
      return { affectedRows: 1 };
    }
  }

  return [];
}

initDb();

module.exports = {
  query,
  initDb,
  getDriver: () => dbDriver
};
