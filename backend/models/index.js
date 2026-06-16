const mongoose = require('mongoose');

// ─── Notes ────────────────────────────────────────────────────────────────────
const noteSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  pdfUrl: { type: String, required: true },
  pdfPublicId: { type: String },
  fileSize: { type: String, default: '' },
  type: { type: String, enum: ['notes', 'assignment', 'guide', 'other'], default: 'notes' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

// ─── Attendance ───────────────────────────────────────────────────────────────
const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  joinTime: { type: Date, default: Date.now },
  leaveTime: { type: Date },
  duration: { type: Number, default: 0 }, // minutes attended
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
}, { timestamps: true });

attendanceSchema.index({ userId: 1, classId: 1 }, { unique: true });

// ─── Payments ─────────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  subscriptionPlan: { type: String, enum: ['basic', 'premium', 'vip'], required: true },
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  couponCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  receiptSent: { type: Boolean, default: false },
}, { timestamps: true });

// ─── Certificates ─────────────────────────────────────────────────────────────
const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  courseName: { type: String, required: true },
  certificateId: { type: String, unique: true },
  pdfUrl: { type: String },
  issuedAt: { type: Date, default: Date.now },
  qrCode: { type: String },
  instructorName: { type: String },
  isValid: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Notifications ────────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isGlobal: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'class', 'payment'], default: 'info' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
}, { timestamps: true });

// ─── Coupons ──────────────────────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  validTill: { type: Date },
  isActive: { type: Boolean, default: true },
  applicablePlans: [String],
}, { timestamps: true });

// ─── Blog ─────────────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: { type: String, default: 'beauty' },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = {
  Note: mongoose.model('Note', noteSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Payment: mongoose.model('Payment', paymentSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Coupon: mongoose.model('Coupon', couponSchema),
  Blog: mongoose.model('Blog', blogSchema),
};
