const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/controllers');

router.get('/', protect, c.getMyNotifications);
router.put('/mark-read', protect, c.markRead);
router.post('/send', protect, adminOnly, c.sendNotification);

module.exports = router;
