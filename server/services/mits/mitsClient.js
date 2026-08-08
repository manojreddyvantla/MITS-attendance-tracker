/**
 * MITS Client HTTP handler template
 */
const axios = require('axios');

class MitsClient {
  constructor(baseURL = 'http://mitsims.in') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MITS-Attendance-AI/1.0'
      }
    });
  }

  async checkPortalStatus() {
    try {
      const response = await this.client.get('/');
      return { available: response.status === 200, status: response.status };
    } catch (err) {
      return { available: false, error: err.message };
    }
  }
}

module.exports = MitsClient;
