const Student = require('../models/Student');
const Course = require('../models/Course');

exports.createStudent = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newStudent = new Student({ name, email });
    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'A student with this email already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courses', ['courseName', 'courseCode']);
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.enrollStudentInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) return res.status(404).json({ msg: 'Student or Course not found' });
    if (!student.courses.includes(courseId)) student.courses.push(courseId);
    if (!course.students.includes(studentId)) course.students.push(studentId);
    await student.save();
    await course.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTION ---
exports.updateStudent = async (req, res) => {
  const { name, email } = req.body;
  try {
    const duplicate = await Student.findOne({ email, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ msg: 'A student with this email already exists.' });
    }
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!updatedStudent) return res.status(404).json({ msg: 'Student not found' });
    res.json(updatedStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};