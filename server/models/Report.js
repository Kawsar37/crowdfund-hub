const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  campaign_title: { type: String, required: true },
  reporter_name: { type: String, required: true },
  reporter_email: { type: String, required: true },
  reason: { type: String, required: true },
  report_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' }
});

reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
