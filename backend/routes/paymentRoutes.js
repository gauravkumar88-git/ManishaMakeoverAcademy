const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

// router.post('/create-order', protect, ctrl.createOrder);
// router.post('/verify', protect, ctrl.verifyPayment);
// router.get('/my-payments', protect, ctrl.getMyPayments);
// router.post('/validate-coupon', protect, ctrl.validateCoupon);
router.post('/create-order', protect, ctrl.createOrder);

router.post('/verify', protect, ctrl.verifyPayment);

router.post('/verify-dummy', protect, ctrl.verifyDummy);

router.get('/my-payments', protect, ctrl.getMyPayments);

router.post('/validate-coupon', protect, ctrl.validateCoupon);

module.exports = router;
