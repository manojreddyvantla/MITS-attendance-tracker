const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, attendanceController.getAttendance);
router.get('/overall', authenticateToken, attendanceController.getOverallAttendance);
router.get('/history', authenticateToken, attendanceController.getHistory);
router.get('/subjects/:subjectId', authenticateToken, attendanceController.getSubjectById);
router.post('/sync', authenticateToken, attendanceController.syncAttendance);

module.exports = router;
