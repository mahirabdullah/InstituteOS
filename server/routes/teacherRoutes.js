const express = require('express');
const router = express.Router();
const { getTeachers, addTeacher, removeTeacher } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTeachers).post(protect, addTeacher);
router.route('/:id').delete(protect, removeTeacher);

module.exports = router;