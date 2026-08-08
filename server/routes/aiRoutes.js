const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/chat', authenticateToken, aiController.handleAIChat);
router.get('/conversations', authenticateToken, aiController.getConversations);

module.exports = router;
