const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  googleId: { type: String },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  phone: { type: String, default: '' },

  // Subscription
  subscriptionPlan: { type: String, enum: ['none', 'basic', 'premium', 'vip'], default: 'none' },
  subscriptionExpiry: { type: Date },
  subscriptionActive: { type: Boolean, default: false },

  // Referral
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Reset password
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  isVerified: { type: Boolean, default: false },
  verificationToken: String,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isSubscriptionValid = function () {
  return this.subscriptionActive === true;
};

module.exports = mongoose.model('User', userSchema);
