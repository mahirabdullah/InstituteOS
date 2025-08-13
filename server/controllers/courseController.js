// C:\Users\MAHIR\Projects\sms\server\controllers\courseController.js

const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  try {
    const newCourse = new Course({ courseName, courseCode });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// You would add more functions here for assigning teachers/students, etc.
// For example: assignTeacherToCourse, enrollStudentInCourse