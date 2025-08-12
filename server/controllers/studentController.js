const Student = require('../models/studentModel');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  const students = await Student.find({});
  res.json(students);
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('completedCourses', 'courseName courseCode');
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
};

// @desc    Add a new student
// @route   POST /api/students
// @access  Private/Admin
const addStudent = async (req, res) => {
  const { studentId, name, email, dateOfBirth } = req.body;
  const studentExists = await Student.findOne({ $or: [{ studentId }, { email }] });

  if (studentExists) {
    return res.status(400).json({ message: 'Student with this ID or Email already exists' });
  }
  
  const student = new Student({ studentId, name, email, dateOfBirth });
  const createdStudent = await student.save();
  res.status(201).json(createdStudent);
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const removeStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (student) {
    await student.deleteOne();
    res.json({ message: 'Student removed' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
};

// @desc    Mark a course as completed for a student
// @route   POST /api/students/:id/complete-course
// @access  Private/Admin
const completeCourseForStudent = async (req, res) => {
  const { courseId } = req.body;
  const student = await Student.findById(req.params.id);

  if (student && courseId) {
      if(student.completedCourses.includes(courseId)) {
        return res.status(400).json({ message: 'Student has already completed this course' });
      }
      student.completedCourses.push(courseId);
      await student.save();
      res.json({ message: 'Course marked as completed for student' });
  } else {
      res.status(404).json({ message: 'Student not found or courseId not provided' });
  }
};


module.exports = { getStudents, getStudentById, addStudent, removeStudent, completeCourseForStudent };