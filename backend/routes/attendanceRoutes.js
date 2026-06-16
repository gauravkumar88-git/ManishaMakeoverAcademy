// attendanceRoutes.js
const express = require('express');
const attendanceRouter = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/controllers');

attendanceRouter.get('/my', protect, c.getMyAttendance);
attendanceRouter.get('/class/:classId', protect, adminOnly, c.getClassAttendance);

module.exports = attendanceRouter;
