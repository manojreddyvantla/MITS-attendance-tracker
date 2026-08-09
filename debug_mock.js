const mock = require('./server/services/mits/mockMitsProvider');

async function debug() {
  const rollNumber = '24691A3365'; // user's roll number
  const data = await mock.fetchMockAttendance(rollNumber);
  console.log(JSON.stringify(data, null, 2));
}

debug();
