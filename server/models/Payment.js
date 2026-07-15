const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  user_name: { type: String, required: true },
  amount: { type: Number, required: true },
  credits_purchased: { type: Number, required: true },
  package_name: { type: String, default: '' },
  stripe_payment_id: { type: String, default: '' },
  payment_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'failed', 'pending'], default: 'completed' }
});

paymentSchema.index({ user_email: 1, payment_date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
