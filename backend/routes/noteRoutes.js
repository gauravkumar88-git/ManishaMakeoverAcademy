// noteRoutes.js
const express = require('express');
const noteRouter = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadPDF } = require('../config/cloudinary');
const c = require('../controllers/controllers');

noteRouter.get('/', protect, c.getAllNotes);
noteRouter.get('/class/:classId', protect, c.getNotesByClass);
noteRouter.post('/', protect, adminOnly, uploadPDF.single('pdf'), c.uploadNote);
noteRouter.delete('/:id', protect, adminOnly, c.deleteNote);
noteRouter.post('/:id/download', protect, c.trackDownload);

module.exports = noteRouter;

// ─── Also export other routers ────────────────────────────────────────────────
// paymentRoutes.js
const payRouter = express.Router();
const payCtrl = require('../controllers/paymentController');
payRouter.post('/create-order', protect, payCtrl.createOrder);
payRouter.post('/verify', protect, payCtrl.verifyPayment);
payRouter.get('/my-payments', protect, payCtrl.getMyPayments);
payRouter.post('/validate-coupon', protect, payCtrl.validateCoupon);

module.exports.paymentRouter = payRouter;
