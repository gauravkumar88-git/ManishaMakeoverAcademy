const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorAvatar: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  category: {
    type: String,
    enum: ['bridal', 'skincare', 'hair', 'nail', 'makeup', 'eyebrow', 'mehndi', 'other'],
    default: 'makeup'
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 }, // minutes
  meetLink: { type: String, required: true },
  recordingUrl: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  requiredPlan: { type: String, enum: ['basic', 'premium', 'vip'], default: 'basic' },
  maxStudents: { type: Number, default: 100 },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
