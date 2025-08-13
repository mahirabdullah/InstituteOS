// C:\Users\MAHIR\Projects\sms\server\controllers\teacherController.js

const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

// @desc    Create a new teacher
exports.createTeacher = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newTeacher = new Teacher({ name, email });
    const teacher = await newTeacher.save();
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('courses', ['courseName', 'courseCode']);
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('courses', ['courseName', 'courseCode']);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    // TODO: Also remove this teacher from any courses they are assigned to
    
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Teacher removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Assign a course to a teacher
exports.assignCourseToTeacher = async (req, res) => {
  try {
    const { courseId } = req.body;
    const teacherId = req.params.id;

    const teacher = await Teacher.findById(teacherId);
    const course = await Course.findById(courseId);

    if (!teacher || !course) {
        return res.status(404).json({ msg: 'Teacher or Course not found' });
    }

    // Add course to teacher's list if not already there
    if (!teacher.courses.includes(courseId)) {
        teacher.courses.push(courseId);
        await teacher.save();
    }

    // Add teacher to course's list if not already there
    if (!course.teachers.includes(teacherId)) {
        course.teachers.push(teacherId);
        await course.save();
    }

    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};