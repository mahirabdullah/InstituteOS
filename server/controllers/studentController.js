// C:\Users\MAHIR\Projects\sms\server\controllers\studentController.js

const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Create a new student
exports.createStudent = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newStudent = new Student({ name, email });
    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courses', ['courseName', 'courseCode']);
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courses', ['courseName', 'courseCode']);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    
    // TODO: Also delist this student from any courses they are enrolled in

    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Enroll a student in a course
exports.enrollStudentInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
        return res.status(404).json({ msg: 'Student or Course not found' });
    }

    // Add course to student's list
    if (!student.courses.includes(courseId)) {
        student.courses.push(courseId);
        await student.save();
    }

    // Add student to course's list
    if (!course.students.includes(studentId)) {
        course.students.push(studentId);
        await course.save();
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};