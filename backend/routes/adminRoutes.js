const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/controllers');

router.use(protect, adminOnly);

router.get('/dashboard', c.getDashboardStats);
router.get('/students', c.getAllStudents);
router.delete('/students/:id', c.deleteStudent);
router.get('/payments', c.getAllPayments);
router.post('/coupons', c.createCoupon);
router.get('/coupons', c.getCoupons);
router.patch('/coupons/:id/toggle', c.toggleCoupon);

module.exports = router;
