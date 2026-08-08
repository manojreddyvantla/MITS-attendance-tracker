const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/calculate', authenticateToken, calculatorController.calculateAttendance);

module.exports = router;
