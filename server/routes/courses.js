// C:\Users\MAHIR\Projects\sms\server\routes\courses.js

const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, deleteCourse } = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware'); // Import middleware

// Add the 'auth' middleware before your controller functions
router.post('/', auth, createCourse);
router.get('/', auth, getAllCourses);
router.delete('/:id', auth, deleteCourse);

module.exports = router;