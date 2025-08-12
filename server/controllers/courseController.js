const Course = require('../models/courseModel');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private/Admin
const getCourses = async (req, res) => {
  const courses = await Course.find({}).populate('teacher', 'name');
  res.json(courses);
};

// @desc    Add a new course
// @route   POST /api/courses
// @access  Private/Admin
const addCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  const course = new Course({ courseName, courseCode });
  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

// @desc    Assign a teacher to a course
// @route   PUT /api/courses/:id/assign-teacher
// @access  Private/Admin
const assignTeacherToCourse = async (req, res) => {
  const { teacherId } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    course.teacher = teacherId;
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

module.exports = { getCourses, addCourse, assignTeacherToCourse };