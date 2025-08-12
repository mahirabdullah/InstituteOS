const Teacher = require('../models/teacherModel');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
const getTeachers = async (req, res) => {
  const teachers = await Teacher.find({});
  res.json(teachers);
};

// @desc    Add a new teacher
// @route   POST /api/teachers
// @access  Private/Admin
const addTeacher = async (req, res) => {
  const { employeeId, name, email } = req.body;
  const teacherExists = await Teacher.findOne({ $or: [{ employeeId }, { email }] });

  if (teacherExists) {
    return res.status(400).json({ message: 'Teacher with this ID or Email already exists' });
  }

  const teacher = new Teacher({ employeeId, name, email });
  const createdTeacher = await teacher.save();
  res.status(201).json(createdTeacher);
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const removeTeacher = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    if(teacher) {
        // Optional: Find courses assigned to this teacher and set teacher to null
        // await Course.updateMany({ teacher: teacher._id }, { $set: { teacher: null } });
        await teacher.deleteOne();
        res.json({ message: 'Teacher removed' });
    } else {
        res.status(404).json({ message: 'Teacher not found' });
    }
};

module.exports = { getTeachers, addTeacher, removeTeacher };