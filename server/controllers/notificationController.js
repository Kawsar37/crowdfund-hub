const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ toEmail: req.user.user_email })
      .sort({ time: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications.', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { toEmail: req.user.user_email, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications.', error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ toEmail: req.user.user_email, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notification count.', error: error.message });
  }
};
