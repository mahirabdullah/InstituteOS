const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.createCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  try {
    const newCourse = new Course({ courseName, courseCode });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'A course with this code already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teachers', ['name', 'email'])
      .populate('students', ['name', 'email']);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.assignTeacherToCourse = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        const teacher = await Teacher.findById(teacherId);

        if (!teacher || !course) return res.status(404).json({ msg: 'Teacher or Course not found' });
        if (course.teachers.length >= 2) return res.status(400).json({ msg: 'Course cannot have more than 2 teachers.' });
        if (!course.teachers.includes(teacherId)) course.teachers.push(teacherId);
        if (!teacher.courses.includes(courseId)) teacher.courses.push(courseId);
        await course.save();
        await teacher.save();
        const updatedCourse = await Course.findById(courseId).populate('teachers', ['name', 'email']);
        res.json(updatedCourse.teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.enrollStudentInCourse = async (req, res) => {
    try {
        const { studentId } = req.body;
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        const student = await Student.findById(studentId);

        if (!student || !course) return res.status(404).json({ msg: 'Student or Course not found' });
        if (course.students.length >= 30) return res.status(400).json({ msg: 'Course cannot have more than 30 students.' });
        if (!course.students.includes(studentId)) course.students.push(studentId);
        if (!student.courses.includes(courseId)) student.courses.push(courseId);
        await course.save();
        await student.save();
        const updatedCourse = await Course.findById(courseId).populate('students', ['name', 'email']);
        res.json(updatedCourse.students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION ---
exports.updateCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  try {
    const duplicate = await Course.findOne({ courseCode, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ msg: 'A course with this code already exists.' });
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, courseCode },
      { new: true }
    );
    if (!updatedCourse) return res.status(404).json({ msg: 'Course not found' });
    res.json(updatedCourse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};