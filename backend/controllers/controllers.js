// ─── Notes Controller ─────────────────────────────────────────────────────────
const { Note, Attendance, Certificate, Notification } = require('../models/index');
const Class = require('../models/Class');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// Notes
exports.getNotesByClass = async (req, res) => {
  const notes = await Note.find({ classId: req.params.classId }).sort({ createdAt: -1 });
  res.json({ success: true, notes });
};

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find().populate('classId', 'title date').sort({ createdAt: -1 });
  res.json({ success: true, notes });
};

exports.uploadNote = async (req, res) => {
  console.log("FILE:", req.file);

  const { classId, title, description, type } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "PDF required"
    });
  }

  const note = await Note.create({
    classId,
    title,
    description,
    pdfUrl: req.file.path,
    pdfPublicId: req.file.filename,
    type: type || "notes",
    uploadedBy: req.user._id
  });

  res.status(201).json({
    success: true,
    note
  });



  // Notify students
  const cls = await Class.findById(classId);
  await Notification.create({
    isGlobal: true,
    title: `New Notes: ${title} 📄`,
    message: `Notes for "${cls?.title || 'class'}" have been uploaded.`,
    type: 'info',
    link: `/notes/${note._id}`,
  });

  res.status(201).json({ success: true, note });
};

exports.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Note deleted.' });
};

exports.trackDownload = async (req, res) => {
  await Note.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
  res.json({ success: true });
};

// ─── Attendance Controller ────────────────────────────────────────────────────
exports.getMyAttendance = async (req, res) => {
  const records = await Attendance.find({ userId: req.user._id }).populate('classId', 'title date time');
  const totalClasses = await Class.countDocuments({ status: 'completed' });
  const attended = records.length;
  const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;
  res.json({ success: true, attendance: records, totalClasses, attended, percentage });
};

exports.getClassAttendance = async (req, res) => {
  const records = await Attendance.find({ classId: req.params.classId }).populate('userId', 'name email avatar');
  res.json({ success: true, attendance: records, count: records.length });
};

// ─── Certificate Controller ───────────────────────────────────────────────────
exports.getMyCertificates = async (req, res) => {
  const certs = await Certificate.find({ userId: req.user._id }).populate('classId', 'title');
  res.json({ success: true, certificates: certs });
};

exports.generateCertificate = async (req, res) => {
  const { classId, courseName } = req.body;
  const existing = await Certificate.findOne({ userId: req.user._id, classId });
  if (existing) return res.json({ success: true, certificate: existing });

  const certificateId = uuidv4().slice(0, 12).toUpperCase();
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;
  const qrCode = await QRCode.toDataURL(verifyUrl);

  const cls = await Class.findById(classId);
  const cert = await Certificate.create({
    userId: req.user._id,
    classId,
    courseName,
    certificateId,
    qrCode,
    instructorName: cls?.instructor || 'Beauty Expert',
  });

  res.status(201).json({ success: true, certificate: cert });
};

exports.verifyCertificate = async (req, res) => {
  const cert = await Certificate.findOne({ certificateId: req.params.id })
    .populate('userId', 'name email avatar')
    .populate('classId', 'title');
  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });
  res.json({ success: true, certificate: cert });
};

// ─── Notification Controller ──────────────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ userId: req.user._id }, { isGlobal: true }]
  }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, notifications });
};

exports.markRead = async (req, res) => {
  await Notification.updateMany(
    { $or: [{ userId: req.user._id }, { isGlobal: true }] },
    { read: true }
  );
  res.json({ success: true, message: 'All marked as read.' });
};

exports.sendNotification = async (req, res) => {
  const { title, message, type, userId, isGlobal } = req.body;
  const notif = await Notification.create({ title, message, type, userId: isGlobal ? undefined : userId, isGlobal: !!isGlobal });
  res.status(201).json({ success: true, notification: notif });
};

// ─── Admin Controller ─────────────────────────────────────────────────────────
const { Payment, Coupon } = require('../models/index');

exports.getDashboardStats = async (req, res) => {
  const [totalStudents, totalRevenue, activeSubscribers, totalClasses, totalPayments] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ subscriptionActive: true }),
    Class.countDocuments(),
    Payment.countDocuments({ status: 'paid' }),
  ]);

  const recentPayments = await Payment.find({ status: 'paid' }).populate('userId', 'name email').sort({ createdAt: -1 }).limit(5);
  const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    stats: {
      totalStudents,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeSubscribers,
      totalClasses,
      totalPayments,
    },
    recentPayments,
    recentStudents,
  });
};

exports.getAllStudents = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = { role: 'student' };
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const students = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await User.countDocuments(filter);
  res.json({ success: true, students, total });
};

exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find({ status: 'paid' }).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, payments });
};

exports.createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
};

exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
};

exports.toggleCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  coupon.isActive = !coupon.isActive;
  await coupon.save();
  res.json({ success: true, coupon });
};

exports.deleteStudent = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Student deleted.' });
};
