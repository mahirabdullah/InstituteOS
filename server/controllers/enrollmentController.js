const Enrollment = require('../models/Enrollment');

// Get all enrollments for a specific course
exports.getEnrollmentsForCourse = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.courseId }).populate('student', ['name', 'email']);
        res.json(enrollments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update marks for a specific enrollment
exports.updateMarks = async (req, res) => {
    try {
        const { marks } = req.body;
        if (marks < 0 || marks > 100) {
            return res.status(400).json({ msg: 'Marks must be between 0 and 100.' });
        }
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { marks },
            { new: true }
        ).populate('student', ['name', 'email']);

        res.json(enrollment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};