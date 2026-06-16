const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/classController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

router.get('/', ctrl.getAllClasses);
router.get('/upcoming', ctrl.getUpcomingClasses);
router.get('/:id', ctrl.getClass);
// router.post('/', protect, adminOnly, ctrl.createClass);
router.post('/', protect, adminOnly, uploadImage.single('thumbnail'), ctrl.createClass);
router.put('/:id', protect, adminOnly, uploadImage.single('thumbnail'), ctrl.updateClass);
router.delete('/:id', protect, adminOnly, ctrl.deleteClass);
router.post('/:id/join', protect, ctrl.joinClass);

module.exports = router;
