const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  toEmail: { type: String, required: true },
  actionRoute: { type: String, default: '/' },
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

notificationSchema.index({ toEmail: 1, time: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
