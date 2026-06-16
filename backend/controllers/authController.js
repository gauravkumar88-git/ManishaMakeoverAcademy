const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

  const referralCode = uuidv4().slice(0, 8).toUpperCase();
  const user = await User.create({ name, email, password, phone, referralCode });

  await sendEmail({
    to: user.email,
    subject: '🌸 Welcome to Beauty Master Academy!',
    template: 'welcome',
    data: { name: user.name },
  });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, subscriptionPlan: user.subscriptionPlan } });
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, subscriptionPlan: user.subscriptionPlan, subscriptionActive: user.subscriptionActive, subscriptionExpiry: user.subscriptionExpiry } });
};

// @POST /api/auth/google
exports.googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  const ticket = await client.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
  const { name, email, picture, sub: googleId } = ticket.getPayload();

  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (user) {
    if (!user.googleId) { user.googleId = googleId; user.avatar = picture; await user.save(); }
  } else {
    const referralCode = uuidv4().slice(0, 8).toUpperCase();
    user = await User.create({ name, email, googleId, avatar: picture, referralCode, isVerified: true });
    await sendEmail({ to: user.email, subject: '🌸 Welcome to Beauty Master Academy!', template: 'welcome', data: { name } });
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, subscriptionPlan: user.subscriptionPlan, subscriptionActive: user.subscriptionActive } });
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
};

// @POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ success: false, message: 'No user with that email.' });

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: '🔑 Password Reset - Beauty Master Academy',
    template: 'resetPassword',
    data: { name: user.name, resetUrl },
  });

  res.json({ success: true, message: 'Password reset email sent.' });
};

// @POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  sendTokenCookie(res, token);
  res.json({ success: true, message: 'Password reset successful.' });
};

// @PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const updateData = { name, phone };
  if (req.file) updateData.avatar = req.file.path;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
  res.json({ success: true, user });
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const match = await user.comparePassword(req.body.currentPassword);
  if (!match) return res.status(400).json({ success: false, message: 'Current password incorrect.' });
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated.' });
};
