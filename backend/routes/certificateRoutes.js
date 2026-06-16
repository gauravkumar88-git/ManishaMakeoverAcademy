const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/controllers');

router.get('/my', protect, c.getMyCertificates);
router.post('/generate', protect, c.generateCertificate);
router.get('/verify/:id', c.verifyCertificate);

module.exports = router;
