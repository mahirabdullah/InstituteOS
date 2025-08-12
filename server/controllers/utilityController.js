const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Course = require('../models/courseModel');

// @desc    Get dashboard stats
// @route   GET /api/utils/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  const studentCount = await Student.countDocuments();
  const teacherCount = await Teacher.countDocuments();
  const courseCount = await Course.countDocuments();
  res.json({ students: studentCount, teachers: teacherCount, courses: courseCount });
};

// @desc    Search for students or teachers
// @route   GET /api/utils/search?q=...
// @access  Private/Admin
const searchDirectory = async (req, res) => {
  const query = req.query.q ? { name: { $regex: req.query.q, $options: 'i' } } : {};
  const students = await Student.find({ ...query }).limit(10);
  const teachers = await Teacher.find({ ...query }).limit(10);
  res.json({ students, teachers });
};

// @desc    Generate certificate data
// @route   POST /api/utils/generate-certificate
// @access  Public
const generateCertificate = async (req, res) => {
  const { studentId, courseCode } = req.body;

  if (!studentId || !courseCode) {
    return res.status(400).json({ message: 'Student ID and Course Code are required' });
  }

  const student = await Student.findOne({ studentId: studentId });
  const course = await Course.findOne({ courseCode: courseCode });

  if (!student || !course) {
    return res.status(404).json({ message: 'Invalid student ID or course code' });
  }

  const courseCompleted = student.completedCourses.some(completedCourseId => completedCourseId.equals(course._id));
  
  if(courseCompleted) {
    res.json({
      message: 'Verification successful. Certificate can be generated.',
      studentName: student.name,
      courseName: course.courseName,
      completionDate: new Date().toLocaleDateString(),
    });
  } else {
    res.status(400).json({ message: 'Student has not completed this course' });
  }
};

module.exports = { getDashboardStats, searchDirectory, generateCertificate };