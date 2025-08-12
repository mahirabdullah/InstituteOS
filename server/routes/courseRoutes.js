const express = require('express');
const router = express.Router();
const { getCourses, addCourse, assignTeacherToCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCourses).post(protect, addCourse);
router.route('/:id/assign-teacher').put(protect, assignTeacherToCourse);

module.exports = router;