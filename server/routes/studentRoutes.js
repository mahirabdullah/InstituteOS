const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, addStudent, removeStudent, completeCourseForStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStudents).post(protect, addStudent);
router.route('/:id').get(protect, getStudentById).delete(protect, removeStudent);
router.route('/:id/complete-course').post(protect, completeCourseForStudent);


module.exports = router;