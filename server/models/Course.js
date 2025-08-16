const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: { 
    type: String, 
    required: true,
    trim: true 
  },
  courseCode: { // This is the correct field name
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model('Course', CourseSchema);