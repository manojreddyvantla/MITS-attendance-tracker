const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/predict', authenticateToken, predictionController.predictAttendanceRisk);

module.exports = router;
