const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaign_title: { type: String, required: true, trim: true },
  campaign_story: { type: String, required: true },
  category: { type: String, required: true, enum: ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment', 'Music', 'Film', 'Games', 'Other'] },
  funding_goal: { type: Number, required: true, min: 1 },
  minimum_Contribution: { type: Number, required: true, min: 1 },
  deadline: { type: Date, required: true },
  reward_info: { type: String, default: '' },
  campaign_image_url: { type: String, default: '' },
  amount_raised: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  creator_email: { type: String, required: true },
  creator_name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

campaignSchema.index({ status: 1, deadline: 1 });
campaignSchema.index({ creator_email: 1 });
campaignSchema.index({ amount_raised: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
