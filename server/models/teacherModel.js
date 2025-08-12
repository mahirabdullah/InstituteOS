const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;