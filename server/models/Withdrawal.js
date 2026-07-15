const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  creator_email: { type: String, required: true },
  creator_name: { type: String, required: true },
  withdrawal_credit: { type: Number, required: true, min: 200 },
  withdrawal_amount: { type: Number, required: true },
  payment_system: { type: String, required: true, enum: ['Stripe', 'Bkash', 'Rocket', 'Nagad', 'Other'] },
  account_number: { type: String, required: true },
  withdraw_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

withdrawalSchema.index({ creator_email: 1, status: 1 });
withdrawalSchema.index({ status: 1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
