const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, getUnreadCount } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getMyNotifications);
router.get('/unread-count', verifyToken, getUnreadCount);
router.patch('/mark-read', verifyToken, markAsRead);

module.exports = router;
