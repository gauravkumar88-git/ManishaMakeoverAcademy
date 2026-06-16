// ─── authRoutes.js ────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/google', ctrl.googleLogin);
router.get('/me', protect, ctrl.getMe);
router.post('/logout', protect, ctrl.logout);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password/:token', ctrl.resetPassword);
router.put('/update-profile', protect, uploadImage.single('avatar'), ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);

module.exports = router;
