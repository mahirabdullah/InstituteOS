const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getEnrollmentsForCourse, updateMarks } = require('../controllers/enrollmentController');

router.get('/course/:courseId', auth, getEnrollmentsForCourse);
router.put('/:id/marks', auth, updateMarks);

module.exports = router;