const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

exports.createTeacher = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newTeacher = new Teacher({ name, email });
    const teacher = await newTeacher.save();
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'A teacher with this email already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('courses', ['courseName', 'courseCode']);
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Teacher removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.assignCourseToTeacher = async (req, res) => {
    try {
        const { courseId } = req.body;
        const teacherId = req.params.id;
        const teacher = await Teacher.findById(teacherId);
        const course = await Course.findById(courseId);

        if (!teacher || !course) return res.status(404).json({ msg: 'Teacher or Course not found' });
        if (!teacher.courses.includes(courseId)) teacher.courses.push(courseId);
        if (!course.teachers.includes(teacherId)) course.teachers.push(teacherId);
        await teacher.save();
        await course.save();
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION ---
exports.updateTeacher = async (req, res) => {
  const { name, email } = req.body;
  try {
    const duplicate = await Teacher.findOne({ email, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ msg: 'A teacher with this email already exists.' });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!updatedTeacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(updatedTeacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};