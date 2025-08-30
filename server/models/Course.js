const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: { 
    type: String, 
    required: true,
    trim: true 
  },
  courseCode: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);