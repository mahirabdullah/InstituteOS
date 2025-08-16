// C:\Users\MAHIR\Projects\sms\server\controllers\courseController.js

const Course = require('../models/Course');

// Create a new course - UPDATED FUNCTION
exports.createCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  try {
    const newCourse = new Course({ courseName, courseCode });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    // --- THIS IS THE NEW DIAGNOSTIC LOG ---
    console.log("--- DATABASE SAVE ERROR ---");
    console.log("The full error object from MongoDB is:", err);
    // --- END OF LOG ---

    // Check for the specific duplicate key error from MongoDB
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Database error: A course with this code already exists.' });
    }
    
    // For any other errors, send a generic server error
    res.status(500).send('Server Error');
  }
};

// Get all courses - NO CHANGES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete a course - NO CHANGES
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