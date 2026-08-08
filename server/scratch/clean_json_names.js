const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../server/data/mits_attendance.json');
if (fs.existsSync(jsonPath)) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  data.users = data.users.map(u => {
    if (u.roll_number === '24691A3365') {
      u.full_name = 'VANTLA MANOJ KUMAR REDDY';
    } else if (u.roll_number === '24691A3360') {
      u.full_name = 'KOTAKONDA MADHURI';
    } else if (u.full_name && u.full_name.startsWith('$2a$')) {
      u.full_name = `Student (${u.roll_number})`;
    }
    return u;
  });

  data.students = data.students.map(s => {
    if (s.roll_number === '24691A3365') {
      s.full_name = 'VANTLA MANOJ KUMAR REDDY';
    } else if (s.roll_number === '24691A3360') {
      s.full_name = 'KOTAKONDA MADHURI';
    } else if (s.full_name && s.full_name.startsWith('$2a$')) {
      s.full_name = `Student (${s.roll_number})`;
    }
    return s;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Cleaned mits_attendance.json successfully!");
}
