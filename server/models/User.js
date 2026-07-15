const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  display_name: { type: String, required: true, trim: true },
  user_email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  photo_url: { type: String, default: '' },
  password: { type: String, required: function() { return !this.googleAuth; } },
  role: { type: String, enum: ['supporter', 'creator', 'admin'], default: 'supporter' },
  credits: { type: Number, default: 0 },
  googleAuth: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ user_email: 1 });

module.exports = mongoose.model('User', userSchema);
