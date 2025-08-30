const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  marks: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  gradePoint: {
    type: Number,
  },
  letterGrade: {
    type: String,
  },
  remarks: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);