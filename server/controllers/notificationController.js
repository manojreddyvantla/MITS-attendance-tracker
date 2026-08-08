/**
 * Notification Controller
 * Manages smart user notifications.
 */

const db = require('../config/db');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30`,
      [userId]
    );

    const unreadCount = (await db.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    ))[0]?.count || 0;

    res.json({
      success: true,
      unreadCount,
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: Boolean(n.is_read),
        createdAt: n.created_at
      }))
    });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (id === 'all') {
      await db.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
    } else {
      await db.query(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [id, userId]);
    }

    res.json({ success: true, message: "Notification(s) marked as read." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markAsRead
};
