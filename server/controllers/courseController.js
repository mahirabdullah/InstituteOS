const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

// Create a new course
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

// GET only ACTIVE courses for the main course list
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET a single course by its ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teachers', ['name', 'email']);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET all COMPLETED courses for the results page
exports.getCompletedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Completed' }).sort({ updatedAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing course
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

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Assign a teacher to a course
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

// Un-assign a teacher from a course
exports.unassignTeacherFromCourse = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const courseId = req.params.id;
        await Course.findByIdAndUpdate(courseId, { $pull: { teachers: teacherId } });
        await Teacher.findByIdAndUpdate(teacherId, { $pull: { courses: courseId } });
        const updatedCourse = await Course.findById(courseId).populate('teachers', ['name', 'email']);
        res.json(updatedCourse.teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Enroll a student in a course
exports.enrollStudentInCourse = async (req, res) => {
    try {
        const { studentId } = req.body;
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        const student = await Student.findById(studentId);

        if (!student || !course) return res.status(404).json({ msg: 'Student or Course not found' });
        if (course.status === 'Completed') return res.status(400).json({ msg: 'Cannot enroll in a completed course.' });
        
        const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        if (existingEnrollment) return res.status(400).json({ msg: 'Student is already enrolled in this course.' });

        const newEnrollment = new Enrollment({ student: studentId, course: courseId });
        await newEnrollment.save();
        
        if (!student.courses.includes(courseId)) {
            student.courses.push(courseId);
            await student.save();
        }
        res.json(newEnrollment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Un-enroll a student from a course
exports.unenrollStudentFromCourse = async (req, res) => {
    try {
        const { studentId } = req.body;
        const courseId = req.params.id;
        const enrollment = await Enrollment.findOneAndDelete({ student: studentId, course: courseId });
        if (!enrollment) {
            return res.status(404).json({ msg: 'Enrollment record not found.' });
        }
        await Student.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
        const updatedEnrollments = await Enrollment.find({ course: courseId }).populate('student', ['name', 'email']);
        res.json(updatedEnrollments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Mark a course as complete and calculate grades
exports.completeCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        const enrollments = await Enrollment.find({ course: req.params.id });
        for (const enrollment of enrollments) {
            const marks = enrollment.marks;
            let gradePoint, letterGrade, remarks;
            if (marks >= 90) { gradePoint = 4.0; letterGrade = 'A'; remarks = 'Excellent'; }
            else if (marks >= 85) { gradePoint = 3.7; letterGrade = 'A-'; remarks = 'Great'; }
            else if (marks >= 80) { gradePoint = 3.3; letterGrade = 'B+'; remarks = 'Good'; }
            else if (marks >= 75) { gradePoint = 3.0; letterGrade = 'B'; remarks = 'Good'; }
            else if (marks >= 70) { gradePoint = 2.7; letterGrade = 'B-'; remarks = 'Fair'; }
            else if (marks >= 65) { gradePoint = 2.3; letterGrade = 'C+'; remarks = 'Fair'; }
            else if (marks >= 60) { gradePoint = 2.0; letterGrade = 'C'; remarks = 'Fair'; }
            else if (marks >= 57) { gradePoint = 1.7; letterGrade = 'C-'; remarks = 'Poor'; }
            else if (marks >= 55) { gradePoint = 1.3; letterGrade = 'D+'; remarks = 'Poor'; }
            else if (marks >= 52) { gradePoint = 1.0; letterGrade = 'D'; remarks = 'Poor'; }
            else if (marks >= 50) { gradePoint = 0.7; letterGrade = 'D-'; remarks = 'Poor'; }
            else { gradePoint = 0.0; letterGrade = 'F'; remarks = 'Failure'; }
            enrollment.gradePoint = gradePoint;
            enrollment.letterGrade = letterGrade;
            enrollment.remarks = remarks;
            await enrollment.save();
        }
        course.status = 'Completed';
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};